<?php

namespace App\Models;

use App\Models\Address;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'description',
        'address',
        'phone',
        'working_hours',
        'logo',
        'location_url',
        'instagram',
        'telegram',
        'delivery_price',
        'is_active',
    ];

    protected $casts = [
        'delivery_price' => 'float',
        'is_active' => 'boolean',
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class)->orderBy('order');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function foodItems(): HasMany
    {
        return $this->hasManyThrough(FoodItem::class, Category::class);
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class)->orderBy('order');
    }
}
