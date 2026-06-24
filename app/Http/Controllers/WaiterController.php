<?php

namespace App\Http\Controllers;

use App\Models\Table;
use App\Models\Order;
use App\Models\OrderSession;
use App\Models\OrderItem;
use App\Models\FoodItem;
use App\Models\Restaurant;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class WaiterController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Show all tables
     */
    public function tables(): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();
        $tables = Table::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('is_active', true)
            ->orderBy('number')
            ->get()
            ->map(function ($table) {
                $activeSession = $table->activeSession();
                $orders = [];
                
                if ($activeSession) {
                    $orders = $activeSession->orders()
                        ->where('payment_status', '!=', 'paid')
                        ->with(['items.foodItem'])
                        ->orderBy('created_at', 'desc')
                        ->get()
                        ->map(function ($order) {
                            return [
                                'id' => $order->id,
                                'order_number' => $order->order_number,
                                'customer_name' => $order->customer_name,
                                'total_amount' => $order->total_amount,
                                'status' => $order->status,
                                'payment_status' => $order->payment_status,
                                'is_additional' => $order->is_additional,
                                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                                'items' => $order->items->map(function ($item) {
                                    return [
                                        'id' => $item->id,
                                        'name' => $item->name ?? $item->foodItem->name,
                                        'quantity' => $item->quantity,
                                        'price' => $item->price,
                                    ];
                                })->toArray(),
                            ];
                        })->toArray();
                }

                return [
                    'id' => $table->id,
                    'number' => $table->number,
                    'name' => $table->name,
                    'capacity' => $table->capacity,
                    'status' => $table->status,
                    'has_active_session' => $activeSession !== null,
                    'active_session' => $activeSession ? [
                        'id' => $activeSession->id,
                        'total_amount' => $activeSession->calculateTotal(),
                        'paid_amount' => $activeSession->calculatePaidAmount(),
                        'orders' => $orders,
                    ] : null,
                ];
            });

        return Inertia::render('Waiter/Tables', [
            'tables' => $tables,
            'restaurant' => $restaurant,
        ]);
    }

    /**
     * Show order creation page for a table
     */
    public function createOrder(Table $table): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();

        if (!$restaurant) {
            abort(404, 'Restaurant topilmadi');
        }

        $categories = $restaurant->categories()
            ->where('is_active', true)
            ->with(['foodItems' => function ($query) {
                $query->where('is_available', true)->orderBy('order');
            }])
            ->orderBy('order')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'foodItems' => $category->foodItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'description' => $item->description,
                            'price' => $item->price,
                            'image' => $item->image,
                            'is_available' => (bool) $item->is_available,
                            'order' => $item->order,
                        ];
                    })->toArray(),
                ];
            })
            ->filter(function ($category) {
                return count($category['foodItems']) > 0;
            })
            ->values();

        $activeSession = $table->activeSession();

        return Inertia::render('Waiter/OrderCreate', [
            'table' => $table,
            'categories' => $categories,
            'activeSession' => $activeSession,
        ]);
    }

    /**
     * Store new order
     */
    public function storeOrder(Request $request, Table $table): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:food_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
            'is_additional' => 'boolean',
        ]);

        $restaurant = Restaurant::where('is_active', true)->first();
        
        if (!$restaurant) {
            return back()->with('error', 'Restaurant topilmadi');
        }
        
        $waiter = $request->user();

        DB::beginTransaction();

        try {
            // Get or create active session
            $session = $table->activeSession();
            $isAdditional = $validated['is_additional'] ?? false;

            if (!$session && $isAdditional) {
                DB::rollBack();
                return back()->with('error', 'Qo\'shimcha buyurtma uchun avval asosiy buyurtma bo\'lishi kerak');
            }

            if (!$session) {
                // Create new session
                $session = OrderSession::create([
                    'table_id' => $table->id,
                    'waiter_id' => $waiter->id,
                    'status' => 'active',
                    'started_at' => now(),
                ]);

                // Update table status
                $table->update(['status' => 'occupied']);
            }

            // Calculate total
            $totalAmount = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $foodItem = FoodItem::find($item['id']);
                if ($foodItem && $foodItem->is_available) {
                    $totalAmount += $foodItem->price * $item['quantity'];
                    $orderItems[] = [
                        'food_item_id' => $foodItem->id,
                        'quantity' => $item['quantity'],
                        'price' => $foodItem->price,
                        'name' => $foodItem->name,
                    ];
                }
            }

            if (empty($orderItems)) {
                DB::rollBack();
                return back()->with('error', 'Taomlar topilmadi');
            }

            // Get parent order if additional
            $parentOrder = null;
            if ($isAdditional && $session->orders()->exists()) {
                $parentOrder = $session->orders()->first();
            }

            // Create order
            $order = Order::create([
                'restaurant_id' => $restaurant->id,
                'table_id' => $table->id,
                'order_session_id' => $session->id,
                'waiter_id' => $waiter->id,
                'customer_name' => $validated['customer_name'] ?? null,
                'phone' => '', // Table orders don't need phone
                'total_amount' => $totalAmount,
                'delivery_price' => 0, // No delivery for table orders
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'is_additional' => $isAdditional,
                'parent_order_id' => $parentOrder?->id,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'food_item_id' => $item['food_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            // Reload order with items
            $order->load('items.foodItem', 'table', 'waiter');

            // Update session total
            $session->update(['total_amount' => $session->calculateTotal()]);

            DB::commit();

            // Log order creation
            Log::info("Order created: #{$order->order_number}, Status: {$order->status}, Restaurant ID: {$order->restaurant_id}");

            // Send to Telegram (Kitchen)
            try {
                $this->telegramService->sendOrderNotificationWithButtons($order, $orderItems, $restaurant);
            } catch (\Exception $e) {
                Log::error('Telegram notification failed: ' . $e->getMessage());
            }

            return redirect()->route('waiter.orders.active')
                ->with('success', 'Buyurtma yaratildi! Oshxonaga yuborildi.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Order creation failed: ' . $e->getMessage());
            return back()->with('error', 'Xatolik yuz berdi: ' . $e->getMessage());
        }
    }

    /**
     * Show active orders
     */
    public function activeOrders(): Response
    {
        $waiter = request()->user();
        $restaurant = Restaurant::where('is_active', true)->first();

        $orders = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('waiter_id', $waiter->id)
            ->whereIn('status', ['pending', 'confirmed', 'preparing', 'ready'])
            ->with(['table', 'items.foodItem', 'orderSession'])
            ->latest()
            ->get();

        return Inertia::render('Waiter/ActiveOrders', [
            'orders' => $orders,
        ]);
    }

    /**
     * Mark order as delivered
     */
    public function markDelivered(Order $order): RedirectResponse
    {
        if ($order->status !== 'ready') {
            return back()->with('error', 'Buyurtma hali tayyor emas');
        }

        $order->markAsDelivered();

        // Check if all orders in session are delivered
        if ($order->orderSession) {
            $allDelivered = $order->orderSession->orders()
                ->where('status', '!=', 'cancelled')
                ->where('status', '!=', 'delivered')
                ->doesntExist();

            if ($allDelivered) {
                // Notify cashier
                Log::info("All orders delivered for session #{$order->orderSession->id}");
            }
        }

        return back()->with('success', 'Buyurtma yetkazildi deb belgilandi');
    }
}
