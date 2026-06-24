<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderSession extends Model
{
    protected $fillable = [
        'table_id',
        'waiter_id',
        'status',
        'started_at',
        'closed_at',
        'total_amount',
        'paid_amount',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'closed_at' => 'datetime',
        'total_amount' => 'float',
        'paid_amount' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($session) {
            if (empty($session->started_at)) {
                $session->started_at = now();
            }
        });
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }

    public function waiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'waiter_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Calculate total from all orders
    public function calculateTotal(): float
    {
        return $this->orders->sum(function ($order) {
            return $order->total_amount + $order->delivery_price;
        });
    }

    // Calculate paid amount from payments
    public function calculatePaidAmount(): float
    {
        return $this->payments()
            ->where('status', 'completed')
            ->sum('amount');
    }

    // Check if session is fully paid
    public function isFullyPaid(): bool
    {
        return $this->paid_amount >= $this->total_amount;
    }

    // Status helpers
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isClosed(): bool
    {
        return $this->status === 'closed';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    // Close session
    public function close(): void
    {
        $this->update([
            'status' => 'closed',
            'closed_at' => now(),
            'total_amount' => $this->calculateTotal(),
        ]);
    }

    // Mark as paid
    public function markAsPaid(): void
    {
        $this->update([
            'status' => 'paid',
            'paid_amount' => $this->calculatePaidAmount(),
        ]);
    }
}
