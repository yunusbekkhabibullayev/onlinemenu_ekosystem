<?php

namespace App\Http\Controllers;

use App\Models\FoodItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SearchController extends Controller
{
    /**
     * Search food items
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $results = FoodItem::with('category')
            ->where('is_available', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%");
            })
            ->orderBy('name')
            ->limit(10)
            ->get()
            ->map(function ($food) {
                return [
                    'id' => $food->id,
                    'name' => $food->name,
                    'description' => $food->description,
                    'price' => $food->price,
                    'image' => $food->image,
                    'category' => $food->category ? [
                        'id' => $food->category->id,
                        'name' => $food->category->name,
                    ] : null,
                ];
            });

        return response()->json(['results' => $results]);
    }
}
