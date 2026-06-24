<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    protected ?string $botToken;
    protected array $chatIds = [];

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token') ?? '';

        // Bir nechta chat ID larni qo'llab-quvvatlash (vergul bilan ajratilgan)
        $chatIdConfig = config('services.telegram.chat_ids') ?? config('services.telegram.chat_id') ?? '';

        if (!empty($chatIdConfig)) {
            // Vergul bilan ajratilgan ID larni arrayga aylantirish
            $this->chatIds = array_filter(
                array_map('trim', explode(',', $chatIdConfig))
            );
        }
    }

    /**
     * Check if service is configured
     */
    public function isConfigured(): bool
    {
        return !empty($this->botToken) && !empty($this->chatIds);
    }

    /**
     * Get all configured chat IDs
     */
    public function getChatIds(): array
    {
        return $this->chatIds;
    }

    /**
     * Send order notification to all Telegram chats
     */
    public function sendOrderNotification(Order $order, array $items, Restaurant $restaurant): array
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram credentials not configured');
            return [];
        }

        $message = $this->formatOrderMessage($order, $items, $restaurant);
        $results = [];

        foreach ($this->chatIds as $chatId) {
            $result = $this->sendToChat($chatId, $message);
            $results[$chatId] = $result;

            if ($result) {
                Log::info("Telegram notification sent to chat: {$chatId}");
            } else {
                Log::warning("Failed to send Telegram notification to chat: {$chatId}");
            }
        }

        return $results;
    }

    /**
     * Send message to a specific chat
     */
    protected function sendToChat(string $chatId, string $message, string $parseMode = 'HTML'): ?string
    {
        try {
            $response = Http::post("https://api.telegram.org/bot{$this->botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => $parseMode,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['result']['message_id'] ?? null;
            }

            Log::error("Telegram API error for chat {$chatId}: " . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error("Telegram service error for chat {$chatId}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Format order message for Telegram
     */
    protected function formatOrderMessage(Order $order, array $items, Restaurant $restaurant): string
    {
        $date = $order->created_at->format('d.m.Y H:i');

        $itemsText = '';
        foreach ($items as $item) {
            $subtotal = number_format($item['price'] * $item['quantity'], 0, '', ' ');
            $itemsText .= "• {$item['name']} ({$item['quantity']}x) - {$subtotal} UZS\n";
        }

        $deliveryText = number_format($order->delivery_price, 0, '', ' ');
        $totalText = number_format($order->total_amount + $order->delivery_price, 0, '', ' ');

        $message = "🆕 <b>Yangi buyurtma #{$order->order_number}</b>\n\n"
            . "📅 {$date}\n\n";

        // Table information (if exists)
        if ($order->table) {
            $tableInfo = "🪑 <b>Stol:</b> #{$order->table->number}";
            if ($order->table->name) {
                $tableInfo .= " ({$order->table->name})";
            }
            $message .= "{$tableInfo}\n";
        }

        // Customer name (if exists)
        if ($order->customer_name) {
            $message .= "👤 <b>Mijoz:</b> {$order->customer_name}\n";
        }

        // Waiter information
        if ($order->waiter) {
            $message .= "👨‍💼 <b>Ofitsiant:</b> {$order->waiter->display_name}\n";
        }

        // Additional order indicator
        if ($order->is_additional) {
            $message .= "➕ <b>Qo'shimcha buyurtma</b>\n";
        }

        $message .= "\n🍽 <b>Buyurtmalar:</b>\n{$itemsText}\n";

        // Delivery price (only if > 0)
        if ($order->delivery_price > 0) {
            $message .= "🚚 Yetkazib berish: {$deliveryText} UZS\n";
        }

        $message .= "💰 <b>Jami: {$totalText} UZS</b>\n\n";

        // Phone (only if exists and not table order)
        if ($order->phone && !$order->table_id) {
            $message .= "📞 Telefon: {$order->phone}\n\n";
        }

        // Notes (if exists)
        if ($order->notes) {
            $message .= "📝 <b>Eslatma:</b> {$order->notes}\n\n";
        }

        $message .= "🏪 {$restaurant->name}";

        return $message;
    }

    /**
     * Send order notification with inline keyboard buttons
     */
    public function sendOrderNotificationWithButtons(Order $order, array $items, Restaurant $restaurant): array
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram credentials not configured');
            return [];
        }

        $message = $this->formatOrderMessage($order, $items, $restaurant);
        $keyboard = $this->getKeyboardForStatus($order->id, 'pending');
        $results = [];

        foreach ($this->chatIds as $chatId) {
            $result = $this->sendMessageWithKeyboard($chatId, $message, $keyboard);
            $results[$chatId] = $result;

            if ($result) {
                Log::info("Telegram notification with buttons sent to chat: {$chatId}");
            } else {
                Log::warning("Failed to send Telegram notification to chat: {$chatId}");
            }
        }

        return $results;
    }

    /**
     * Get inline keyboard based on current status
     */
    protected function getKeyboardForStatus(int $orderId, string $status): array
    {
        $buttons = match($status) {
            'pending' => [
                [
                    ['text' => '✅ Qabul qilish', 'callback_data' => "order_confirm_{$orderId}"],
                    ['text' => '❌ Bekor qilish', 'callback_data' => "order_cancel_{$orderId}"],
                ]
            ],
            'confirmed' => [
                [
                    ['text' => '👨‍🍳 Tayyorlashni boshlash', 'callback_data' => "order_preparing_{$orderId}"],
                ]
            ],
            'preparing' => [
                [
                    ['text' => '✅ Tayyor', 'callback_data' => "order_ready_{$orderId}"],
                ]
            ],
            'ready' => [
                // No buttons - waiter will mark as delivered from dashboard
            ],
            default => []
        };

        return ['inline_keyboard' => $buttons];
    }

    /**
     * Send message with inline keyboard
     */
    protected function sendMessageWithKeyboard(string $chatId, string $message, array $keyboard): ?int
    {
        try {
            $response = Http::post("https://api.telegram.org/bot{$this->botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'HTML',
                'reply_markup' => json_encode($keyboard),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['result']['message_id'] ?? null;
            }

            Log::error("Telegram API error for chat {$chatId}: " . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error("Telegram service error for chat {$chatId}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Update message with new keyboard (after status change)
     */
    public function updateMessageKeyboard(string $chatId, int $messageId, string $newText, int $orderId, string $newStatus): bool
    {
        try {
            $keyboard = $this->getKeyboardForStatus($orderId, $newStatus);

            $response = Http::post("https://api.telegram.org/bot{$this->botToken}/editMessageText", [
                'chat_id' => $chatId,
                'message_id' => $messageId,
                'text' => $newText,
                'parse_mode' => 'HTML',
                'reply_markup' => json_encode($keyboard),
            ]);

            return $response->successful();

        } catch (\Exception $e) {
            Log::error("Failed to update message keyboard: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Answer callback query (to remove loading state from button)
     */
    public function answerCallbackQuery(string $callbackQueryId, string $text = '', bool $showAlert = false): bool
    {
        try {
            $response = Http::post("https://api.telegram.org/bot{$this->botToken}/answerCallbackQuery", [
                'callback_query_id' => $callbackQueryId,
                'text' => $text,
                'show_alert' => $showAlert,
            ]);

            return $response->successful();

        } catch (\Exception $e) {
            Log::error("Failed to answer callback query: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send order status update notification
     */
    public function sendStatusUpdateNotification(Order $order, string $oldStatus, string $newStatus): array
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram credentials not configured for status update');
            return [];
        }

        $message = $this->formatStatusUpdateMessage($order, $oldStatus, $newStatus);
        $results = [];

        foreach ($this->chatIds as $chatId) {
            $result = $this->sendToChat($chatId, $message);
            $results[$chatId] = $result;

            if ($result) {
                Log::info("Telegram status update sent to chat: {$chatId}");
            } else {
                Log::warning("Failed to send Telegram status update to chat: {$chatId}");
            }
        }

        return $results;
    }

    /**
     * Format status update message for Telegram
     */
    protected function formatStatusUpdateMessage(Order $order, string $oldStatus, string $newStatus): string
    {
        $statusLabels = [
            'pending' => '⏳ Kutilmoqda',
            'confirmed' => '✅ Qabul qilindi',
            'preparing' => '👨‍🍳 Tayyorlanmoqda',
            'ready' => '✅ Tayyor',
            'delivered' => '🚚 Yetkazildi',
            'paid' => '💳 To\'langan',
            'cancelled' => '❌ Bekor qilindi',
        ];

        $statusEmojis = [
            'pending' => '⏳',
            'confirmed' => '✅',
            'preparing' => '👨‍🍳',
            'ready' => '✅',
            'delivered' => '🚚',
            'paid' => '💳',
            'cancelled' => '❌',
        ];

        $emoji = $statusEmojis[$newStatus] ?? '📋';
        $oldLabel = $statusLabels[$oldStatus] ?? $oldStatus;
        $newLabel = $statusLabels[$newStatus] ?? $newStatus;

        $date = now()->format('d.m.Y H:i');
        $totalText = number_format($order->total_amount + $order->delivery_price, 0, '', ' ');

        $message = "{$emoji} <b>Buyurtma statusi yangilandi</b>\n\n"
            . "🔢 Buyurtma: <b>#{$order->order_number}</b>\n";

        // Table information
        if ($order->table) {
            $message .= "🪑 Stol: #{$order->table->number}\n";
        }

        $message .= "📅 Vaqt: {$date}\n\n"
            . "📊 Status o'zgarishi:\n"
            . "   {$oldLabel} ➜ {$newLabel}\n\n"
            . "💰 Jami: <b>{$totalText} UZS</b>\n";

        // Phone (only if exists and not table order)
        if ($order->phone && !$order->table_id) {
            $message .= "📞 Telefon: {$order->phone}\n";
        }

        // Qo'shimcha xabar statuga qarab
        $additionalMessage = match($newStatus) {
            'confirmed' => "\n\n💬 Buyurtma qabul qilindi! Tayyorlash boshlandi.",
            'preparing' => "\n\n💬 Buyurtma tayyorlanmoqda. Biroz kuting!",
            'ready' => "\n\n💬 ⚠️ Buyurtma tayyor! Ofitsiantga xabar yuborildi.",
            'delivered' => "\n\n💬 Buyurtma yetkazildi. To'lovni kutamiz.",
            'paid' => "\n\n💬 ✅ Buyurtma to'liq to'langan. Rahmat!",
            'cancelled' => "\n\n💬 Buyurtma bekor qilindi.",
            default => '',
        };

        return $message . $additionalMessage;
    }

    /**
     * Send custom message to all Telegram chats
     */
    public function sendMessage(string $message): array
    {
        if (!$this->isConfigured()) {
            return [];
        }

        $results = [];

        foreach ($this->chatIds as $chatId) {
            $results[$chatId] = $this->sendToChat($chatId, $message, '') !== null;
        }

        return $results;
    }

    /**
     * Send message to specific chat IDs (not all configured ones)
     */
    public function sendToSpecificChats(array $chatIds, string $message, string $parseMode = 'HTML'): array
    {
        if (empty($this->botToken)) {
            return [];
        }

        $results = [];

        foreach ($chatIds as $chatId) {
            $results[$chatId] = $this->sendToChat($chatId, $message, $parseMode) !== null;
        }

        return $results;
    }
}
