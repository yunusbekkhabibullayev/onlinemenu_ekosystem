<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'order_session_id',
        'amount',
        'payment_method',
        'status',
        'processed_by',
        'notes',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function orderSession(): BelongsTo
    {
        return $this->belongsTo(OrderSession::class);
    }

    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // Status helpers
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    // Mark as completed
    public function markAsCompleted(): void
    {
        $this->update(['status' => 'completed']);
    }

    // Mark as refunded
    public function markAsRefunded(): void
    {
        $this->update(['status' => 'refunded']);
    }
}
