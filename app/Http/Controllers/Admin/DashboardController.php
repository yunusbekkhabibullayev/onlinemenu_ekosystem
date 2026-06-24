<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\FoodItem;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();

        $stats = [
            'todayOrders' => Order::whereDate('created_at', $today)->count(),
            'totalRevenue' => Order::whereIn('status', ['delivered', 'paid'])
                ->sum(DB::raw('total_amount + delivery_price')),
            'todayRevenue' => Order::whereIn('status', ['delivered', 'paid'])
                ->whereDate('created_at', $today)
                ->sum(DB::raw('total_amount + delivery_price')),
            'totalFoods' => FoodItem::where('is_available', true)->count(),
            'totalCategories' => Category::where('is_active', true)->count(),
            'pendingOrders' => Order::where('status', 'pending')->count(),
        ];

        $recentOrders = Order::with('items.foodItem')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
