<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderSession;
use App\Models\Payment;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CashierController extends Controller
{
    /**
     * Cashier dashboard
     */
    public function dashboard(): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();

        // Orders pending payment
        $pendingPayments = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('status', 'delivered')
            ->where('payment_status', '!=', 'paid')
            ->with(['table', 'items.foodItem', 'waiter', 'orderSession'])
            ->orderBy('delivered_at', 'asc')
            ->get();

        // Today's payments
        $todayPayments = Payment::whereDate('created_at', today())
            ->where('status', 'completed')
            ->with(['order', 'orderSession', 'processor'])
            ->orderBy('created_at', 'desc')
            ->get();

        $todayTotal = $todayPayments->sum('amount');

        return Inertia::render('Cashier/Dashboard', [
            'pendingPayments' => $pendingPayments,
            'todayPayments' => $todayPayments,
            'todayTotal' => $todayTotal,
        ]);
    }

    /**
     * Show orders pending payment
     */
    public function pendingPayments(): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();

        $orders = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('status', 'delivered')
            ->where('payment_status', '!=', 'paid')
            ->with(['table', 'items.foodItem', 'waiter', 'orderSession', 'payments'])
            ->orderBy('delivered_at', 'asc')
            ->get();

        return Inertia::render('Cashier/PendingPayments', [
            'orders' => $orders,
        ]);
    }

    /**
     * Process payment for a single order
     */
    public function processPayment(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,card,online',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($order->status !== 'delivered') {
            return back()->with('error', 'Faqat yetkazilgan buyurtmalar uchun to\'lov qabul qilinadi');
        }

        if ($order->payment_status === 'paid') {
            return back()->with('error', 'Buyurtma allaqachon to\'langan');
        }

        $cashier = $request->user();
        $amount = (float) $validated['amount'];
        $grandTotal = $order->total_amount + $order->delivery_price;
        $paidAmount = $order->payments()->where('status', 'completed')->sum('amount');
        $remaining = $grandTotal - $paidAmount;

        if ($amount > $remaining) {
            return back()->with('error', "To'lov summasi qolgan summa ({$remaining}) dan oshib ketdi");
        }

        DB::beginTransaction();

        try {
            // Create payment
            $payment = Payment::create([
                'order_id' => $order->id,
                'order_session_id' => $order->order_session_id,
                'amount' => $amount,
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'processed_by' => $cashier->id,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Update order payment status
            $newPaidAmount = $paidAmount + $amount;
            $paymentStatus = 'partial';
            if ($newPaidAmount >= $grandTotal) {
                $paymentStatus = 'paid';
                $order->markAsPaid($validated['payment_method']);
            } else {
                $order->update(['payment_status' => 'partial']);
            }

            // Update order session
            if ($order->orderSession) {
                $session = $order->orderSession;
                $session->update(['paid_amount' => $session->calculatePaidAmount()]);

                // Check if all orders in session are paid
                $allPaid = $session->orders()
                    ->where('status', '!=', 'cancelled')
                    ->where('payment_status', '!=', 'paid')
                    ->doesntExist();

                if ($allPaid) {
                    $session->markAsPaid();
                    // Free the table
                    $session->table->update(['status' => 'available']);
                }
            }

            DB::commit();

            Log::info("Payment processed: Order #{$order->order_number}, Amount: {$amount}, Method: {$validated['payment_method']}");

            return back()->with('success', "To'lov qabul qilindi. Qolgan summa: " . ($grandTotal - $newPaidAmount));

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Payment processing failed: ' . $e->getMessage());
            return back()->with('error', 'Xatolik yuz berdi: ' . $e->getMessage());
        }
    }

    /**
     * Process payment for entire session
     */
    public function sessionPayment(Request $request, OrderSession $session): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,card,online',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($session->status === 'paid') {
            return back()->with('error', 'Sessiya allaqachon to\'langan');
        }

        $cashier = $request->user();
        $amount = (float) $validated['amount'];
        $totalAmount = $session->calculateTotal();
        $paidAmount = $session->calculatePaidAmount();
        $remaining = $totalAmount - $paidAmount;

        if ($amount > $remaining) {
            return back()->with('error', "To'lov summasi qolgan summa ({$remaining}) dan oshib ketdi");
        }

        DB::beginTransaction();

        try {
            // Create payment for session
            $payment = Payment::create([
                'order_session_id' => $session->id,
                'amount' => $amount,
                'payment_method' => $validated['payment_method'],
                'status' => 'completed',
                'processed_by' => $cashier->id,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Update session
            $newPaidAmount = $paidAmount + $amount;
            $session->update(['paid_amount' => $newPaidAmount]);

            // If fully paid, mark all orders as paid
            if ($newPaidAmount >= $totalAmount) {
                $session->markAsPaid();
                $session->orders()->where('status', '!=', 'cancelled')->each(function ($order) use ($validated) {
                    $order->markAsPaid($validated['payment_method']);
                });

                // Free the table
                $session->table->update(['status' => 'available']);
            }

            DB::commit();

            Log::info("Session payment processed: Session #{$session->id}, Amount: {$amount}");

            return back()->with('success', "To'lov qabul qilindi. Qolgan summa: " . ($totalAmount - $newPaidAmount));

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Session payment processing failed: ' . $e->getMessage());
            return back()->with('error', 'Xatolik yuz berdi: ' . $e->getMessage());
        }
    }
}
