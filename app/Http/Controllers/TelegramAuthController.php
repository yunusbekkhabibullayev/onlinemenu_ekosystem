<?php

namespace App\Http\Controllers;

use App\Services\TelegramAuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TelegramAuthController extends Controller
{
    protected TelegramAuthService $telegramAuthService;

    public function __construct(TelegramAuthService $telegramAuthService)
    {
        $this->telegramAuthService = $telegramAuthService;
    }

    /**
     * Authenticate user from Telegram Mini App
     */
    public function authenticate(Request $request): JsonResponse
    {
        $initData = $request->input('initData') ?? $request->header('X-Telegram-Init-Data');

        if (empty($initData)) {
            return response()->json([
                'success' => false,
                'message' => 'initData not provided',
            ], 400);
        }

        $user = $this->telegramAuthService->authenticateFromWebApp($initData);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication failed',
            ], 401);
        }

        // Login the user
        Auth::login($user);

        Log::info("Telegram user authenticated: {$user->telegram_id} - {$user->display_name}");

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->display_name,
                'email' => $user->email,
                'role' => $user->role,
                'telegram_id' => $user->telegram_id,
                'telegram_username' => $user->telegram_username,
                'telegram_photo_url' => $user->telegram_photo_url,
            ],
        ]);
    }

    /**
     * Check if user is authenticated via Telegram
     */
    public function check(Request $request): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'authenticated' => false,
            ]);
        }

        return response()->json([
            'authenticated' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->display_name,
                'email' => $user->email,
                'role' => $user->role,
                'telegram_id' => $user->telegram_id,
                'telegram_username' => $user->telegram_username,
                'telegram_photo_url' => $user->telegram_photo_url,
            ],
        ]);
    }

    /**
     * Logout
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
