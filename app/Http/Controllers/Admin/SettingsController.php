<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    /**
     * Show settings page
     */
    public function index(): Response
    {
        $webhookUrl = url('/telegram/webhook');
        $webhookStatus = $this->getWebhookStatus();

        return Inertia::render('Admin/Settings/Index', [
            'telegram' => [
                'bot_token' => $this->maskToken(config('services.telegram.bot_token')),
                'chat_ids' => config('services.telegram.chat_ids') ?? config('services.telegram.chat_id') ?? '',
                'is_configured' => !empty(config('services.telegram.bot_token')),
                'webhook_url' => $webhookUrl,
                'webhook_status' => $webhookStatus,
            ],
            'app' => [
                'name' => config('app.name'),
                'timezone' => config('app.timezone'),
                'locale' => config('app.locale'),
                'url' => config('app.url'),
            ],
        ]);
    }

    /**
     * Get current webhook status from Telegram
     */
    private function getWebhookStatus(): ?array
    {
        $botToken = config('services.telegram.bot_token');

        if (empty($botToken)) {
            return null;
        }

        try {
            $response = Http::get("https://api.telegram.org/bot{$botToken}/getWebhookInfo");

            if ($response->successful()) {
                $data = $response->json();
                return $data['result'] ?? null;
            }
        } catch (\Exception $e) {
            Log::error('Failed to get webhook status: ' . $e->getMessage());
        }

        return null;
    }

    /**
     * Test Telegram connection
     */
    public function testTelegram(Request $request)
    {
        $telegramService = app(\App\Services\TelegramService::class);

        if (!$telegramService->isConfigured()) {
            return response()->json([
                'success' => false,
                'message' => 'Telegram sozlanmagan. .env faylida TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_IDS ni tekshiring.',
            ]);
        }

        $results = $telegramService->sendMessage("✅ Test xabar - Telegram ulanishi muvaffaqiyatli!\n\n🕐 " . now()->format('d.m.Y H:i:s'));

        $successCount = count(array_filter($results));
        $totalCount = count($results);

        if ($successCount > 0) {
            return response()->json([
                'success' => true,
                'message' => "Telegram ulanishi muvaffaqiyatli! {$successCount}/{$totalCount} chatga yuborildi.",
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Telegram ga xabar yuborib bo\'lmadi. Bot token va chat ID larni tekshiring.',
        ]);
    }

    /**
     * Clear application cache
     */
    public function clearCache()
    {
        try {
            Artisan::call('config:clear');
            Artisan::call('cache:clear');
            Artisan::call('view:clear');

            return response()->json([
                'success' => true,
                'message' => 'Kesh muvaffaqiyatli tozalandi!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Keshni tozalab bo\'lmadi: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Set Telegram webhook
     */
    public function setWebhook(Request $request)
    {
        $botToken = config('services.telegram.bot_token');

        if (empty($botToken)) {
            return response()->json([
                'success' => false,
                'message' => 'Bot token sozlanmagan!',
            ]);
        }

        $webhookUrl = url('/telegram/webhook');

        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/setWebhook", [
                'url' => $webhookUrl,
                'allowed_updates' => ['callback_query', 'message'],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if ($data['ok'] ?? false) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Webhook muvaffaqiyatli sozlandi!',
                        'webhook_url' => $webhookUrl,
                    ]);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Webhook sozlab bo\'lmadi: ' . ($response->json()['description'] ?? 'Noma\'lum xato'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Webhook sozlab bo\'lmadi: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Delete Telegram webhook
     */
    public function deleteWebhook()
    {
        $botToken = config('services.telegram.bot_token');

        if (empty($botToken)) {
            return response()->json([
                'success' => false,
                'message' => 'Bot token sozlanmagan!',
            ]);
        }

        try {
            $response = Http::post("https://api.telegram.org/bot{$botToken}/deleteWebhook");

            if ($response->successful()) {
                $data = $response->json();
                if ($data['ok'] ?? false) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Webhook o\'chirildi!',
                    ]);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Webhook o\'chirib bo\'lmadi',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Webhook o\'chirib bo\'lmadi: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Mask sensitive token for display
     */
    private function maskToken(?string $token): string
    {
        if (empty($token)) {
            return '';
        }

        $length = strlen($token);
        if ($length <= 10) {
            return str_repeat('*', $length);
        }

        return substr($token, 0, 5) . str_repeat('*', $length - 10) . substr($token, -5);
    }
}
