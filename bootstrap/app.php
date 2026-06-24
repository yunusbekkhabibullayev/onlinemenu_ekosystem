<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'waiter' => \App\Http\Middleware\WaiterMiddleware::class,
            'kitchen' => \App\Http\Middleware\KitchenMiddleware::class,
            'cashier' => \App\Http\Middleware\CashierMiddleware::class,
        ]);

        // CSRF dan exclude qilish (public API endpoints)
        $middleware->validateCsrfTokens(except: [
            'telegram/webhook',
            'telegram/auth',
            'telegram/auth/logout',
            'orders',  // Public order submission
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
