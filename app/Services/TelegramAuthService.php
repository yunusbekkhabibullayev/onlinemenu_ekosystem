<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class TelegramAuthService
{
    protected ?string $botToken;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token');
    }

    /**
     * Validate Telegram WebApp initData
     * @see https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
     */
    public function validateInitData(string $initData): ?array
    {
        if (empty($this->botToken) || empty($initData)) {
            return null;
        }

        try {
            // Parse initData
            parse_str($initData, $data);

            if (!isset($data['hash'])) {
                Log::warning('Telegram auth: hash not found');
                return null;
            }

            $hash = $data['hash'];
            unset($data['hash']);

            // Sort by key
            ksort($data);

            // Create data check string
            $dataCheckString = '';
            foreach ($data as $key => $value) {
                $dataCheckString .= "{$key}={$value}\n";
            }
            $dataCheckString = rtrim($dataCheckString, "\n");

            // Calculate secret key
            $secretKey = hash_hmac('sha256', $this->botToken, 'WebAppData', true);

            // Calculate hash
            $calculatedHash = bin2hex(hash_hmac('sha256', $dataCheckString, $secretKey, true));

            if (!hash_equals($calculatedHash, $hash)) {
                Log::warning('Telegram auth: invalid hash');
                return null;
            }

            // Check auth_date (not older than 24 hours)
            if (isset($data['auth_date'])) {
                $authDate = (int) $data['auth_date'];
                if (time() - $authDate > 86400) {
                    Log::warning('Telegram auth: data expired');
                    return null;
                }
            }

            // Parse user data
            if (isset($data['user'])) {
                $userData = json_decode($data['user'], true);
                if ($userData) {
                    return $userData;
                }
            }

            return $data;

        } catch (\Exception $e) {
            Log::error('Telegram auth validation error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Authenticate user from Telegram WebApp
     */
    public function authenticateFromWebApp(string $initData): ?User
    {
        $telegramData = $this->validateInitData($initData);

        if (!$telegramData || !isset($telegramData['id'])) {
            return null;
        }

        return User::findOrCreateByTelegram($telegramData);
    }

    /**
     * Get user data from initData without full validation (for debugging)
     */
    public function parseInitData(string $initData): ?array
    {
        try {
            parse_str($initData, $data);

            if (isset($data['user'])) {
                return json_decode($data['user'], true);
            }

            return $data;
        } catch (\Exception $e) {
            return null;
        }
    }
}
