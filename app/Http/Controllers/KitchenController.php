<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Restaurant;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class KitchenController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Kitchen dashboard
     */
    public function dashboard(): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();

        // Pending orders
        $pendingOrders = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('status', 'pending')
            ->with(['table', 'items.foodItem', 'waiter'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Confirmed orders
        $confirmedOrders = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('status', 'confirmed')
            ->with(['table', 'items.foodItem', 'waiter'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Preparing orders
        $preparingOrders = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('status', 'preparing')
            ->with(['table', 'items.foodItem', 'waiter'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Ready orders
        $readyOrders = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->where('status', 'ready')
            ->with(['table', 'items.foodItem', 'waiter'])
            ->orderBy('ready_at', 'asc')
            ->get();

        return Inertia::render('Kitchen/Dashboard', [
            'pendingOrders' => $pendingOrders,
            'confirmedOrders' => $confirmedOrders,
            'preparingOrders' => $preparingOrders,
            'readyOrders' => $readyOrders,
        ]);
    }

    /**
     * Get all orders for kitchen
     */
    public function orders(): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();

        $orders = Order::where('restaurant_id', $restaurant?->id ?? 1)
            ->whereIn('status', ['pending', 'confirmed', 'preparing', 'ready'])
            ->with(['table', 'items.foodItem', 'waiter', 'orderSession'])
            ->orderBy('created_at', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Kitchen/OrderQueue', [
            'orders' => $orders,
        ]);
    }

    /**
     * Confirm order (accept)
     */
    public function confirm(Order $order): RedirectResponse
    {
        if ($order->status !== 'pending') {
            return back()->with('error', 'Faqat kutilayotgan buyurtmalarni qabul qilish mumkin');
        }

        $oldStatus = $order->status;
        $order->update(['status' => 'confirmed']);

        // Send notification to waiter
        try {
            $this->telegramService->sendStatusUpdateNotification($order, $oldStatus, 'confirmed');
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram notification: " . $e->getMessage());
        }

        return back()->with('success', 'Buyurtma qabul qilindi');
    }

    /**
     * Mark order as preparing
     */
    public function preparing(Order $order): RedirectResponse
    {
        if ($order->status !== 'confirmed') {
            return back()->with('error', 'Faqat tasdiqlangan buyurtmalarni tayyorlashga boshlash mumkin');
        }

        $oldStatus = $order->status;
        $order->update(['status' => 'preparing']);

        // Send notification to waiter
        try {
            $this->telegramService->sendStatusUpdateNotification($order, $oldStatus, 'preparing');
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram notification: " . $e->getMessage());
        }

        return back()->with('success', 'Buyurtma tayyorlanmoqda deb belgilandi');
    }

    /**
     * Mark order as ready
     */
    public function ready(Order $order): RedirectResponse
    {
        if ($order->status !== 'preparing') {
            return back()->with('error', 'Faqat tayyorlanayotgan buyurtmalarni tayyor deb belgilash mumkin');
        }

        $oldStatus = $order->status;
        $order->markAsReady();

        // Send notification to waiter
        try {
            $this->telegramService->sendStatusUpdateNotification($order, $oldStatus, 'ready');
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram notification: " . $e->getMessage());
        }

        return back()->with('success', 'Buyurtma tayyor deb belgilandi. Ofitsiantga xabar yuborildi.');
    }
}
