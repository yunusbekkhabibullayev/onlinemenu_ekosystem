<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    public function index(): Response
    {
        $orders = Order::with('items.foodItem')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load('items.foodItem');

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,preparing,delivered,cancelled',
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        // Agar status o'zgargan bo'lsa
        if ($oldStatus !== $newStatus) {
            $order->update(['status' => $newStatus]);

            // Telegram notification yuborish
            try {
                $results = $this->telegramService->sendStatusUpdateNotification($order, $oldStatus, $newStatus);

                if (!empty($results)) {
                    $successCount = count(array_filter($results));
                    Log::info("Status update notification sent to {$successCount} chat(s) for order #{$order->order_number}");
                }
            } catch (\Exception $e) {
                Log::error("Failed to send Telegram notification for order #{$order->order_number}: " . $e->getMessage());
                // Telegram xato bo'lsa ham, status yangilanadi
            }

            $statusLabels = [
                'pending' => 'Kutilmoqda',
                'confirmed' => 'Tasdiqlangan',
                'preparing' => 'Tayyorlanmoqda',
                'delivered' => 'Yetkazildi',
                'cancelled' => 'Bekor qilindi',
            ];

            return back()->with('success', "Buyurtma statusi \"{$statusLabels[$newStatus]}\" ga o'zgartirildi");
        }

        return back()->with('info', 'Status o\'zgarmadi');
    }
}
