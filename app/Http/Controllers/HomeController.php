<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\FoodItem;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Cache restaurant for 10 minutes
        $restaurant = Cache::remember('active_restaurant', 600, function () {
            return Restaurant::where('is_active', true)->first();
        });

        // Cache featured items for 30 minutes
        $featuredItems = Cache::remember('featured_food_items', 1800, function () {
            $ids = FoodItem::where('is_available', true)
                ->where('price', '>', 0)
                ->pluck('id');

            if ($ids->isEmpty()) {
                return collect();
            }

            $randomIds = $ids->shuffle()->take(6);

            return FoodItem::whereIn('id', $randomIds)
                ->where('is_available', true)
                ->get();
        });

        return Inertia::render('Home', [
            'restaurant' => $restaurant,
            'featuredItems' => $featuredItems,
        ]);
    }
}
