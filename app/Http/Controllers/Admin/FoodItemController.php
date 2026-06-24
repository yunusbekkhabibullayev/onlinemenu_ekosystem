<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FoodItem;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FoodItemController extends Controller
{
    public function index(): Response
    {
        $foods = FoodItem::with('category')
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/Foods/Index', [
            'foods' => $foods,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/Foods/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'is_available' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('foods', 'public');
        }

        $item = FoodItem::create($validated);

        Cache::forget('featured_food_items');
        $restaurantId = $item->category?->restaurant_id;
        if ($restaurantId) {
            Cache::forget("categories_restaurant_{$restaurantId}");
        }

        return redirect()->route('admin.foods.index')
            ->with('success', 'Taom yaratildi');
    }

    public function edit(FoodItem $food): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/Foods/Edit', [
            'food' => $food,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, FoodItem $food): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'is_available' => 'boolean',
            'order' => 'integer|min:0',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($food->image) {
                Storage::disk('public')->delete($food->image);
            }
            $validated['image'] = $request->file('image')->store('foods', 'public');
        }

        $food->update($validated);

        Cache::forget('featured_food_items');

        return redirect()->route('admin.foods.index')
            ->with('success', 'Taom yangilandi');
    }

    public function destroy(FoodItem $food): RedirectResponse
    {
        if ($food->image) {
            Storage::disk('public')->delete($food->image);
        }

        $food->delete();

        Cache::forget('featured_food_items');

        return redirect()->route('admin.foods.index')
            ->with('success', 'Taom o\'chirildi');
    }
}
