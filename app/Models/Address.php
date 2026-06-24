<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    protected $fillable = [
        'restaurant_id',
        'street',
        'city',
        'district',
        'latitude',
        'longitude',
        'is_active',
        'order',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'is_active' => 'boolean',
    ];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeSearch($query, string $q)
    {
        $term = '%' . $q . '%';
        return $query->where(function ($q) use ($term) {
            $q->where('street', 'like', $term)
                ->orWhere('city', 'like', $term)
                ->orWhere('district', 'like', $term);
        });
    }
}
