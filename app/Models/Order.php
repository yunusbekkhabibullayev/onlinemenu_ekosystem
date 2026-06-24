<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'restaurant_id',
        'user_id',
        'table_id',
        'order_session_id',
        'waiter_id',
        'order_number',
        'phone',
        'customer_name',
        'total_amount',
        'delivery_price',
        'status',
        'payment_status',
        'payment_method',
        'paid_at',
        'ready_at',
        'delivered_at',
        'is_additional',
        'parent_order_id',
        'notes',
        'telegram_message_id',
    ];

    protected $casts = [
        'total_amount' => 'float',
        'delivery_price' => 'float',
        'is_additional' => 'boolean',
        'paid_at' => 'datetime',
        'ready_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'ORD-' . strtoupper(uniqid());
            }
        });
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(Table::class);
    }

    public function orderSession(): BelongsTo
    {
        return $this->belongsTo(OrderSession::class);
    }

    public function waiter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'waiter_id');
    }

    public function parentOrder(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'parent_order_id');
    }

    public function additionalOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'parent_order_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Calculate total from items
    public function calculateTotal(): float
    {
        return $this->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });
    }

    // Get grand total with delivery
    public function getGrandTotalAttribute(): float
    {
        return $this->total_amount + $this->delivery_price;
    }

    // Status helpers
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isPreparing(): bool
    {
        return $this->status === 'preparing';
    }

    public function isReady(): bool
    {
        return $this->status === 'ready';
    }

    public function isDelivered(): bool
    {
        return $this->status === 'delivered';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    // Payment status helpers
    public function isUnpaid(): bool
    {
        return $this->payment_status === 'unpaid';
    }

    public function isPartiallyPaid(): bool
    {
        return $this->payment_status === 'partial';
    }

    public function isFullyPaid(): bool
    {
        return $this->payment_status === 'paid';
    }

    // Mark as ready
    public function markAsReady(): void
    {
        $this->update([
            'status' => 'ready',
            'ready_at' => now(),
        ]);
    }

    // Mark as delivered
    public function markAsDelivered(): void
    {
        $this->update([
            'status' => 'delivered',
            'delivered_at' => now(),
        ]);
    }

    // Mark as paid
    public function markAsPaid(string $paymentMethod = 'cash'): void
    {
        $this->update([
            'status' => 'paid',
            'payment_status' => 'paid',
            'payment_method' => $paymentMethod,
            'paid_at' => now(),
        ]);
    }
}
