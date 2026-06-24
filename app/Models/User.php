<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'avatar',
        'password',
        'role',
        'employee_code',
        'is_active',
        'telegram_id',
        'telegram_username',
        'telegram_first_name',
        'telegram_last_name',
        'telegram_photo_url',
        'telegram_auth_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is waiter
     */
    public function isWaiter(): bool
    {
        return $this->role === 'waiter';
    }

    /**
     * Check if user is kitchen staff
     */
    public function isKitchen(): bool
    {
        return $this->role === 'kitchen';
    }

    /**
     * Check if user is cashier
     */
    public function isCashier(): bool
    {
        return $this->role === 'cashier';
    }

    /**
     * Check if user is regular user
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Check if user is staff (waiter, kitchen, cashier, admin)
     */
    public function isStaff(): bool
    {
        return in_array($this->role, ['admin', 'waiter', 'kitchen', 'cashier']);
    }

    /**
     * Check if user is from Telegram
     */
    public function isTelegramUser(): bool
    {
        return !empty($this->telegram_id);
    }

    /**
     * Get display name (Telegram or regular)
     */
    public function getDisplayNameAttribute(): string
    {
        if ($this->telegram_first_name) {
            $name = $this->telegram_first_name;
            if ($this->telegram_last_name) {
                $name .= ' ' . $this->telegram_last_name;
            }
            return $name;
        }

        return $this->name ?? 'Foydalanuvchi';
    }

    /**
     * Find or create user by Telegram data
     */
    public static function findOrCreateByTelegram(array $telegramData): self
    {
        $user = self::where('telegram_id', $telegramData['id'])->first();

        if ($user) {
            // Update existing user's Telegram data
            $user->update([
                'telegram_username' => $telegramData['username'] ?? null,
                'telegram_first_name' => $telegramData['first_name'] ?? null,
                'telegram_last_name' => $telegramData['last_name'] ?? null,
                'telegram_photo_url' => $telegramData['photo_url'] ?? null,
                'telegram_auth_date' => $telegramData['auth_date'] ?? now()->timestamp,
            ]);

            return $user;
        }

        // Create new user
        return self::create([
            'telegram_id' => $telegramData['id'],
            'telegram_username' => $telegramData['username'] ?? null,
            'telegram_first_name' => $telegramData['first_name'] ?? null,
            'telegram_last_name' => $telegramData['last_name'] ?? null,
            'telegram_photo_url' => $telegramData['photo_url'] ?? null,
            'telegram_auth_date' => $telegramData['auth_date'] ?? now()->timestamp,
            'name' => $telegramData['first_name'] ?? 'Telegram User',
            'email' => 'tg_' . $telegramData['id'] . '@telegram.local',
            'role' => 'user',
        ]);
    }
}
