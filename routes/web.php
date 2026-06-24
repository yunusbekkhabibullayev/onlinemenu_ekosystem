<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\TelegramWebhookController;
use App\Http\Controllers\TelegramAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\FoodItemController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\RestaurantController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StaffController;
use App\Http\Controllers\Admin\AIAnalyticsController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\WaiterController;
use App\Http\Controllers\KitchenController;
use App\Http\Controllers\CashierController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (Restaurant Menu)
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/menu', [MenuController::class, 'index'])->name('menu');
Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::get('/account', [AccountController::class, 'index'])->name('account');

// Order API
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');

// Search API
Route::get('/api/search', [SearchController::class, 'search'])->name('search');

// Address search (bazadagi manzillar)
Route::get('/api/addresses/search', [AddressController::class, 'search'])->name('addresses.search');

// AI Recommendations (Smart Upselling)
Route::get('/api/recommendations/{foodItem}', [AIAnalyticsController::class, 'getRecommendations'])->name('api.recommendations');

// Telegram Webhook (CSRF excluded in bootstrap/app.php)
Route::post('/telegram/webhook', [TelegramWebhookController::class, 'handle'])->name('telegram.webhook');

// Telegram Mini App Auth (CSRF excluded in bootstrap/app.php)
Route::post('/telegram/auth', [TelegramAuthController::class, 'authenticate'])->name('telegram.auth');
Route::get('/telegram/auth/check', [TelegramAuthController::class, 'check'])->name('telegram.auth.check');
Route::post('/telegram/auth/logout', [TelegramAuthController::class, 'logout'])->name('telegram.auth.logout');

/*
|--------------------------------------------------------------------------
| Admin Routes (Authentication Required)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Categories
    Route::resource('categories', CategoryController::class);

    // Foods
    Route::resource('foods', FoodItemController::class);

    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');

    // Restaurant
    Route::get('/restaurant', [RestaurantController::class, 'index'])->name('restaurant.index');
    Route::post('/restaurant', [RestaurantController::class, 'update'])->name('restaurant.update');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings/test-telegram', [SettingsController::class, 'testTelegram'])->name('settings.test-telegram');
    Route::post('/settings/clear-cache', [SettingsController::class, 'clearCache'])->name('settings.clear-cache');
    Route::post('/settings/set-webhook', [SettingsController::class, 'setWebhook'])->name('settings.set-webhook');
    Route::post('/settings/delete-webhook', [SettingsController::class, 'deleteWebhook'])->name('settings.delete-webhook');

    // Tables
    Route::get('/tables', [TableController::class, 'index'])->name('tables.index');
    Route::post('/tables', [TableController::class, 'store'])->name('tables.store');
    Route::put('/tables/{table}', [TableController::class, 'update'])->name('tables.update');
    Route::delete('/tables/{table}', [TableController::class, 'destroy'])->name('tables.destroy');
    Route::get('/tables/{table}/qrcode', [TableController::class, 'qrcode'])->name('tables.qrcode');

    // Staff
    Route::resource('staff', StaffController::class)->except(['show']);

    // AI Analytics
    Route::get('/ai-analytics', [AIAnalyticsController::class, 'index'])->name('ai-analytics.index');
    Route::post('/ai-analytics/analyze', [AIAnalyticsController::class, 'analyze'])->name('ai-analytics.analyze');
});

/*
|--------------------------------------------------------------------------
| Waiter Routes (Ofitsiant)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'waiter'])->prefix('waiter')->name('waiter.')->group(function () {
    // Tables
    Route::get('/tables', [WaiterController::class, 'tables'])->name('tables');

    // Orders
    Route::get('/tables/{table}/order', [WaiterController::class, 'createOrder'])->name('order.create');
    Route::post('/tables/{table}/orders', [WaiterController::class, 'storeOrder'])->name('order.store');
    Route::get('/orders/active', [WaiterController::class, 'activeOrders'])->name('orders.active');
    Route::put('/orders/{order}/delivered', [WaiterController::class, 'markDelivered'])->name('order.delivered');
});

/*
|--------------------------------------------------------------------------
| Kitchen Routes (Oshxona)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'kitchen'])->prefix('kitchen')->name('kitchen.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [KitchenController::class, 'dashboard'])->name('dashboard');

    // Orders
    Route::get('/orders', [KitchenController::class, 'orders'])->name('orders');
    Route::put('/orders/{order}/confirm', [KitchenController::class, 'confirm'])->name('order.confirm');
    Route::put('/orders/{order}/preparing', [KitchenController::class, 'preparing'])->name('order.preparing');
    Route::put('/orders/{order}/ready', [KitchenController::class, 'ready'])->name('order.ready');
});

/*
|--------------------------------------------------------------------------
| Cashier Routes (Kassa)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'cashier'])->prefix('cashier')->name('cashier.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [CashierController::class, 'dashboard'])->name('dashboard');

    // Payments
    Route::get('/orders/pending-payment', [CashierController::class, 'pendingPayments'])->name('orders.pending');
    Route::post('/orders/{order}/payment', [CashierController::class, 'processPayment'])->name('payment.process');
    Route::post('/sessions/{session}/payment', [CashierController::class, 'sessionPayment'])->name('session.payment');
});

/*
|--------------------------------------------------------------------------
| User Profile Routes
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/orders', [AccountController::class, 'orders'])->name('orders.index');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
