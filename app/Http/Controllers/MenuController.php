<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\Category;
use App\Models\FoodItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function index(Request $request): Response
    {
        // Cache restaurant for 10 minutes
        $restaurant = Cache::remember('active_restaurant', 600, function () {
            return Restaurant::where('is_active', true)->first();
        });

        $restaurantId = $restaurant?->id;

        // Cache category list per restaurant for 10 minutes
        $categories = Cache::remember("categories_restaurant_{$restaurantId}", 600, function () use ($restaurantId) {
            return Category::where('is_active', true)
                ->when($restaurantId, fn($q) => $q->where('restaurant_id', $restaurantId))
                ->orderBy('order')
                ->get();
        });

        $selectedCategory = $request->get('category');

        // Use whereIn with already-loaded category IDs — avoids correlated subquery
        $categoryIds = $categories->pluck('id');

        $foodItems = FoodItem::where('is_available', true)
            ->when($selectedCategory, fn($q) => $q->where('category_id', $selectedCategory))
            ->when($categoryIds->isNotEmpty(), fn($q) => $q->whereIn('category_id', $categoryIds))
            ->orderBy('order')
            ->get();

        return Inertia::render('Menu', [
            'restaurant' => $restaurant,
            'categories' => $categories,
            'foodItems' => $foodItems,
            'selectedCategory' => $selectedCategory,
        ]);
    }
}
