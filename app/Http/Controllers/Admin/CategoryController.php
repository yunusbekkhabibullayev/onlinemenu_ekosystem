<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('foodItems')
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $restaurant = Restaurant::first();

        $restaurantId = $restaurant?->id ?? 1;

        Category::create([
            'restaurant_id' => $restaurantId,
            'name' => $validated['name'],
            'order' => $validated['order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        Cache::forget("categories_restaurant_{$restaurantId}");

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategoriya yaratildi');
    }

    public function edit(Category $category): Response
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        Cache::forget("categories_restaurant_{$category->restaurant_id}");

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategoriya yangilandi');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $restaurantId = $category->restaurant_id;
        $category->delete();

        Cache::forget("categories_restaurant_{$restaurantId}");

        return redirect()->route('admin.categories.index')
            ->with('success', 'Kategoriya o\'chirildi');
    }
}
