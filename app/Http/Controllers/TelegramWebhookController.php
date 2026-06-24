<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Restaurant;
use App\Models\User;
use App\Services\TelegramService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TelegramWebhookController extends Controller
{
    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    /**
     * Handle incoming webhook from Telegram
     */
    public function handle(Request $request): JsonResponse
    {
        $update = $request->all();

        Log::info('Telegram webhook received', $update);

        // Callback query (inline button press)
        if (isset($update['callback_query'])) {
            return $this->handleCallbackQuery($update['callback_query']);
        }

        // Message (commands like /start, /help, etc.)
        if (isset($update['message'])) {
            return $this->handleMessage($update['message']);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Handle incoming messages (commands)
     */
    protected function handleMessage(array $message): JsonResponse
    {
        $chatId = $message['chat']['id'] ?? null;
        $text = $message['text'] ?? '';
        $firstName = $message['from']['first_name'] ?? 'Foydalanuvchi';
        $fromData = $message['from'] ?? [];

        if (!$chatId) {
            return response()->json(['ok' => true]);
        }

        // Handle commands
        if (str_starts_with($text, '/')) {
            $command = strtolower(explode(' ', $text)[0]);

            return match($command) {
                '/start' => $this->handleStartCommand((string) $chatId, $firstName, $fromData),
                '/help' => $this->handleHelpCommand((string) $chatId),
                '/orders' => $this->handleOrdersCommand((string) $chatId),
                '/stats' => $this->handleStatsCommand((string) $chatId),
                default => $this->handleUnknownCommand((string) $chatId),
            };
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Handle /start command
     */
    protected function handleStartCommand(string $chatId, string $firstName, array $fromData = []): JsonResponse
    {
        // Save or update user in database
        if (!empty($fromData['id'])) {
            $user = User::findOrCreateByTelegram([
                'id' => $fromData['id'],
                'username' => $fromData['username'] ?? null,
                'first_name' => $fromData['first_name'] ?? $firstName,
                'last_name' => $fromData['last_name'] ?? null,
                'photo_url' => null,
                'auth_date' => now()->timestamp,
            ]);

            Log::info("Telegram user saved/updated: {$user->telegram_id} - {$user->display_name}");
        }

        $restaurant = Restaurant::first();
        $restaurantName = $restaurant?->name ?? 'Restaurant';
        $appUrl = config('app.url');

        $message = "👋 <b>Salom, {$firstName}!</b>\n\n"
            . "🏪 <b>{$restaurantName}</b> buyurtmalarni boshqarish botiga xush kelibsiz!\n\n"
            . "━━━━━━━━━━━━━━━━━━\n\n"
            . "📱 <b>Bu bot nima qila oladi:</b>\n"
            . "• 🔔 Yangi buyurtmalar haqida xabar olish\n"
            . "• ✅ Buyurtmalarni tasdiqlash/bekor qilish\n"
            . "• 👨‍🍳 Status o'zgarishlarini boshqarish\n"
            . "• 📊 Statistikani ko'rish\n\n"
            . "━━━━━━━━━━━━━━━━━━\n\n"
            . "📋 <b>Buyruqlar:</b>\n"
            . "/help - Yordam\n"
            . "/orders - Bugungi buyurtmalar\n"
            . "/stats - Statistika\n\n"
            . "🌐 <b>Admin panel:</b>\n"
            . "<a href=\"{$appUrl}/admin\">Admin panelga o'tish</a>\n\n"
            . "🌐 <b>Menyu:</b>\n"
            . "<a href=\"{$appUrl}/menu\">Menyuni ko'rish</a>";

        $keyboard = [
            'inline_keyboard' => [
                [
                    ['text' => '📋 Bugungi buyurtmalar', 'callback_data' => 'today_orders'],
                    ['text' => '📊 Statistika', 'callback_data' => 'stats'],
                ],
                [
                    ['text' => '🍽 Menyuni ochish', 'web_app' => ['url' => "{$appUrl}/menu"]],
                ],
                [
                    ['text' => '⚙️ Admin panel', 'web_app' => ['url' => "{$appUrl}/admin"]],
                ],
            ]
        ];

        $this->sendMessageWithKeyboard($chatId, $message, $keyboard);

        return response()->json(['ok' => true]);
    }

    /**
     * Handle /help command
     */
    protected function handleHelpCommand(string $chatId): JsonResponse
    {
        $message = "📚 <b>Yordam</b>\n\n"
            . "Bu bot orqali restoran buyurtmalarini boshqarishingiz mumkin.\n\n"
            . "━━━━━━━━━━━━━━━━━━\n\n"
            . "📋 <b>Buyruqlar:</b>\n\n"
            . "/start - Botni boshlash\n"
            . "/help - Ushbu yordam xabari\n"
            . "/orders - Bugungi buyurtmalar ro'yxati\n"
            . "/stats - Bugungi statistika\n\n"
            . "━━━━━━━━━━━━━━━━━━\n\n"
            . "🔘 <b>Inline tugmalar:</b>\n\n"
            . "Har bir yangi buyurtma xabari ostida tugmalar paydo bo'ladi:\n"
            . "• <b>✅ Tasdiqlash</b> - Buyurtmani qabul qilish\n"
            . "• <b>❌ Bekor qilish</b> - Buyurtmani rad etish\n"
            . "• <b>👨‍🍳 Tayyorlanmoqda</b> - Tayyorlash boshlandi\n"
            . "• <b>🚚 Yetkazildi</b> - Buyurtma yetkazildi\n\n"
            . "💡 Tugmalarni bosib, buyurtma statusini o'zgartirishingiz mumkin!";

        $this->sendMessage($chatId, $message);

        return response()->json(['ok' => true]);
    }

    /**
     * Handle /orders command - show today's orders
     */
    protected function handleOrdersCommand(string $chatId): JsonResponse
    {
        $today = now()->startOfDay();
        $orders = Order::where('created_at', '>=', $today)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        if ($orders->isEmpty()) {
            $message = "📭 <b>Bugungi buyurtmalar</b>\n\n"
                . "Bugun hali buyurtmalar yo'q.";
        } else {
            $statusEmojis = [
                'pending' => '⏳',
                'confirmed' => '✅',
                'preparing' => '👨‍🍳',
                'delivered' => '🚚',
                'cancelled' => '❌',
            ];

            $message = "📋 <b>Bugungi buyurtmalar</b>\n\n";

            foreach ($orders as $order) {
                $emoji = $statusEmojis[$order->status] ?? '📋';
                $total = number_format($order->total_amount + $order->delivery_price, 0, '', ' ');
                $time = $order->created_at->format('H:i');

                $message .= "{$emoji} <b>#{$order->order_number}</b>\n"
                    . "   💰 {$total} UZS | 🕐 {$time}\n"
                    . "   📞 {$order->phone}\n\n";
            }

            $message .= "━━━━━━━━━━━━━━━━━━\n"
                . "Jami: <b>{$orders->count()}</b> ta buyurtma";
        }

        $this->sendMessage($chatId, $message);

        return response()->json(['ok' => true]);
    }

    /**
     * Handle /stats command - show statistics
     */
    protected function handleStatsCommand(string $chatId): JsonResponse
    {
        $today = now()->startOfDay();

        // Today's stats
        $todayOrders = Order::where('created_at', '>=', $today)->get();
        $todayTotal = $todayOrders->sum(fn($o) => $o->total_amount + $o->delivery_price);
        $todayPending = $todayOrders->where('status', 'pending')->count();
        $todayConfirmed = $todayOrders->where('status', 'confirmed')->count();
        $todayPreparing = $todayOrders->where('status', 'preparing')->count();
        $todayDelivered = $todayOrders->where('status', 'delivered')->count();
        $todayCancelled = $todayOrders->where('status', 'cancelled')->count();

        // This month stats
        $monthStart = now()->startOfMonth();
        $monthOrders = Order::where('created_at', '>=', $monthStart)->get();
        $monthTotal = $monthOrders->sum(fn($o) => $o->total_amount + $o->delivery_price);

        $message = "📊 <b>Statistika</b>\n\n"
            . "━━━━━━━━━━━━━━━━━━\n"
            . "📅 <b>Bugun:</b>\n\n"
            . "📦 Jami buyurtmalar: <b>{$todayOrders->count()}</b>\n"
            . "💰 Jami summa: <b>" . number_format($todayTotal, 0, '', ' ') . " UZS</b>\n\n"
            . "⏳ Kutilmoqda: {$todayPending}\n"
            . "✅ Tasdiqlangan: {$todayConfirmed}\n"
            . "👨‍🍳 Tayyorlanmoqda: {$todayPreparing}\n"
            . "🚚 Yetkazildi: {$todayDelivered}\n"
            . "❌ Bekor qilindi: {$todayCancelled}\n\n"
            . "━━━━━━━━━━━━━━━━━━\n"
            . "📆 <b>Shu oy:</b>\n\n"
            . "📦 Jami buyurtmalar: <b>{$monthOrders->count()}</b>\n"
            . "💰 Jami summa: <b>" . number_format($monthTotal, 0, '', ' ') . " UZS</b>";

        $this->sendMessage($chatId, $message);

        return response()->json(['ok' => true]);
    }

    /**
     * Handle unknown command
     */
    protected function handleUnknownCommand(string $chatId): JsonResponse
    {
        $message = "❓ Noma'lum buyruq.\n\n"
            . "Mavjud buyruqlar ro'yxatini ko'rish uchun /help bosing.";

        $this->sendMessage($chatId, $message);

        return response()->json(['ok' => true]);
    }

    /**
     * Send simple message
     */
    protected function sendMessage(string $chatId, string $message): void
    {
        $botToken = config('services.telegram.bot_token');

        if (empty($botToken)) {
            return;
        }

        try {
            \Illuminate\Support\Facades\Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => true,
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram message: " . $e->getMessage());
        }
    }

    /**
     * Send message with inline keyboard
     */
    protected function sendMessageWithKeyboard(string $chatId, string $message, array $keyboard): void
    {
        $botToken = config('services.telegram.bot_token');

        if (empty($botToken)) {
            return;
        }

        try {
            \Illuminate\Support\Facades\Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
                'reply_markup' => json_encode($keyboard),
                'disable_web_page_preview' => true,
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram message with keyboard: " . $e->getMessage());
        }
    }

    /**
     * Handle callback query from inline keyboard buttons
     */
    protected function handleCallbackQuery(array $callbackQuery): JsonResponse
    {
        $callbackQueryId = $callbackQuery['id'];
        $data = $callbackQuery['data'] ?? '';
        $chatId = $callbackQuery['message']['chat']['id'] ?? null;
        $messageId = $callbackQuery['message']['message_id'] ?? null;
        $fromUser = $callbackQuery['from']['first_name'] ?? 'Admin';

        // Handle order status callbacks
        if (preg_match('/^order_(confirm|cancel|preparing|ready|delivered)_(\d+)$/', $data, $matches)) {
            $action = $matches[1];
            $orderId = (int) $matches[2];

            return $this->processOrderAction($callbackQueryId, $chatId, $messageId, $orderId, $action, $fromUser);
        }

        // Handle menu callbacks
        switch ($data) {
            case 'today_orders':
                $this->telegramService->answerCallbackQuery($callbackQueryId);
                return $this->handleOrdersCommand((string) $chatId);

            case 'stats':
                $this->telegramService->answerCallbackQuery($callbackQueryId);
                return $this->handleStatsCommand((string) $chatId);
        }

        // Unknown callback
        $this->telegramService->answerCallbackQuery($callbackQueryId, 'Noma\'lum amal');
        return response()->json(['ok' => true]);
    }

    /**
     * Process order status change from Telegram
     */
    protected function processOrderAction(
        string $callbackQueryId,
        ?string $chatId,
        ?int $messageId,
        int $orderId,
        string $action,
        string $fromUser
    ): JsonResponse {
        $order = Order::find($orderId);

        if (!$order) {
            $this->telegramService->answerCallbackQuery($callbackQueryId, '❌ Buyurtma topilmadi!', true);
            return response()->json(['ok' => true]);
        }

        // Map action to new status
        $statusMap = [
            'confirm' => 'confirmed',
            'cancel' => 'cancelled',
            'preparing' => 'preparing',
            'ready' => 'ready',
            'delivered' => 'delivered',
        ];

        $newStatus = $statusMap[$action] ?? null;

        if (!$newStatus) {
            $this->telegramService->answerCallbackQuery($callbackQueryId, '❌ Noto\'g\'ri amal!', true);
            return response()->json(['ok' => true]);
        }

        // Check if status transition is valid
        $validTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['preparing', 'cancelled'],
            'preparing' => ['ready', 'cancelled'],
            'ready' => ['delivered', 'cancelled'],
            'delivered' => ['paid'],
            'paid' => [],
            'cancelled' => [],
        ];

        if (!in_array($newStatus, $validTransitions[$order->status] ?? [])) {
            $this->telegramService->answerCallbackQuery(
                $callbackQueryId,
                "⚠️ Bu amal hozirgi status uchun mumkin emas!",
                true
            );
            return response()->json(['ok' => true]);
        }

        $oldStatus = $order->status;

        // Update order status
        $order->update(['status' => $newStatus]);

        // Status labels
        $statusLabels = [
            'pending' => '⏳ Kutilmoqda',
            'confirmed' => '✅ Tasdiqlangan',
            'preparing' => '👨‍🍳 Tayyorlanmoqda',
            'delivered' => '🚚 Yetkazildi',
            'cancelled' => '❌ Bekor qilindi',
        ];

        // Answer callback query
        $this->telegramService->answerCallbackQuery(
            $callbackQueryId,
            "✅ Status yangilandi: {$statusLabels[$newStatus]}"
        );

        // Update the message with new status and buttons
        if ($chatId && $messageId) {
            $newMessage = $this->formatUpdatedOrderMessage($order, $oldStatus, $newStatus, $fromUser);
            $this->telegramService->updateMessageKeyboard(
                (string) $chatId,
                $messageId,
                $newMessage,
                $orderId,
                $newStatus
            );
        }

        Log::info("Order #{$order->order_number} status changed via Telegram by {$fromUser}: {$oldStatus} -> {$newStatus}");

        return response()->json(['ok' => true]);
    }

    /**
     * Format updated order message
     */
    protected function formatUpdatedOrderMessage(Order $order, string $oldStatus, string $newStatus, string $changedBy): string
    {
        $order->load('items.foodItem');

        $statusLabels = [
            'pending' => '⏳ Kutilmoqda',
            'confirmed' => '✅ Tasdiqlangan',
            'preparing' => '👨‍🍳 Tayyorlanmoqda',
            'delivered' => '🚚 Yetkazildi',
            'cancelled' => '❌ Bekor qilindi',
        ];

        $statusEmojis = [
            'pending' => '🆕',
            'confirmed' => '✅',
            'preparing' => '👨‍🍳',
            'ready' => '✅',
            'delivered' => '🚚',
            'paid' => '💳',
            'cancelled' => '❌',
        ];

        $emoji = $statusEmojis[$newStatus] ?? '📋';
        $date = $order->created_at->format('d.m.Y H:i');
        $updatedAt = now()->format('H:i');

        // Build items text
        $itemsText = '';
        foreach ($order->items as $item) {
            $subtotal = number_format($item->price * $item->quantity, 0, '', ' ');
            $name = $item->foodItem?->name ?? 'Taom';
            $itemsText .= "• {$name} ({$item->quantity}x) - {$subtotal} UZS\n";
        }

        $deliveryText = number_format($order->delivery_price, 0, '', ' ');
        $totalText = number_format($order->total_amount + $order->delivery_price, 0, '', ' ');

        $restaurant = Restaurant::first();
        $restaurantName = $restaurant?->name ?? 'Restaurant';

        $message = "{$emoji} <b>Buyurtma #{$order->order_number}</b>\n\n"
            . "📅 {$date}\n\n"
            . "🍽 <b>Buyurtmalar:</b>\n{$itemsText}\n"
            . "🚚 Yetkazib berish: {$deliveryText} UZS\n"
            . "💰 <b>Jami: {$totalText} UZS</b>\n\n"
            . "📞 Telefon: {$order->phone}\n\n"
            . "━━━━━━━━━━━━━━━━━━\n"
            . "📊 <b>Status:</b> {$statusLabels[$newStatus]}\n"
            . "👤 <b>O'zgartirdi:</b> {$changedBy}\n"
            . "🕐 <b>Vaqt:</b> {$updatedAt}\n\n"
            . "🏪 {$restaurantName}";

        return $message;
    }
}
