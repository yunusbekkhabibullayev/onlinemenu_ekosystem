<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class RestaurantController extends Controller
{
    /**
     * Show restaurant settings page
     */
    public function index(): Response
    {
        $restaurant = Restaurant::first();

        return Inertia::render('Admin/Restaurant/Index', [
            'restaurant' => $restaurant,
        ]);
    }

    /**
     * Update restaurant settings
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:50',
            'working_hours' => 'nullable|string|max:255',
            'location_url' => 'nullable|url|max:500',
            'instagram' => 'nullable|string|max:255',
            'telegram' => 'nullable|string|max:255',
            'delivery_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'logo' => 'nullable|image|max:2048',
        ]);

        $restaurant = Restaurant::first();

        if (!$restaurant) {
            $restaurant = new Restaurant();
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($restaurant->logo) {
                Storage::disk('public')->delete($restaurant->logo);
            }
            $validated['logo'] = $request->file('logo')->store('restaurants', 'public');
        }

        $restaurant->fill($validated);
        $restaurant->save();

        Cache::forget('active_restaurant');
        Cache::forget('featured_food_items');

        return redirect()->route('admin.restaurant.index')
            ->with('success', 'Restoran ma\'lumotlari yangilandi');
    }
}
