<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $q = trim($request->get('q', ''));
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $restaurant = Restaurant::where('is_active', true)->first();
        if (!$restaurant) {
            return response()->json([]);
        }

        $addresses = Address::where('restaurant_id', $restaurant->id)
            ->active()
            ->search($q)
            ->orderBy('order')
            ->orderBy('street')
            ->limit(10)
            ->get(['id', 'street', 'city', 'district', 'latitude', 'longitude']);

        return response()->json($addresses->map(fn ($a) => [
            'id' => $a->id,
            'street' => $a->street,
            'city' => $a->city,
            'district' => $a->district,
            'display' => implode(', ', array_filter([$a->street, $a->district, $a->city])),
            'latitude' => (float) $a->latitude,
            'longitude' => (float) $a->longitude,
        ]));
    }
}
