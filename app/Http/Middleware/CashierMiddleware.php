<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CashierMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || (!$user->isCashier() && !$user->isAdmin())) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Ruxsat berilmagan. Faqat kassa xodimi yoki admin kirishi mumkin.'], 403);
            }

            return redirect()->route('home')->with('error', 'Sizda kassa paneliga kirish huquqi yo\'q');
        }

        return $next($request);
    }
}
