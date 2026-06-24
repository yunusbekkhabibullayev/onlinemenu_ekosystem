<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $orders = [];

        if ($user && Schema::hasColumn('orders', 'user_id')) {
            $orders = Order::where('user_id', $user->id)
                ->with('items')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get()
                ->map(fn ($o) => [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'total_amount' => $o->total_amount,
                    'delivery_price' => $o->delivery_price,
                    'status' => $o->status,
                    'created_at' => $o->created_at->format('d.m.Y H:i'),
                    'items_count' => $o->items->sum('quantity'),
                ]);
        }

        $restaurant = Cache::remember('active_restaurant', 600, fn () => Restaurant::where('is_active', true)->first());

        return Inertia::render('Account', [
            'orders' => $orders,
            'restaurant' => $restaurant,
        ]);
    }

    public function orders(Request $request): Response
    {
        $user = $request->user();
        $orders = collect();

        if ($user && Schema::hasColumn('orders', 'user_id')) {
            $orders = Order::where('user_id', $user->id)
                ->with('items')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($o) => [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'total_amount' => $o->total_amount,
                    'delivery_price' => $o->delivery_price,
                    'status' => $o->status,
                    'created_at' => $o->created_at->format('d.m.Y H:i'),
                    'items_count' => $o->items->sum('quantity'),
                ]);
        }

        $restaurant = Cache::remember('active_restaurant', 600, fn () => Restaurant::where('is_active', true)->first());

        return Inertia::render('Orders', [
            'orders' => $orders,
            'restaurant' => $restaurant,
        ]);
    }
}
