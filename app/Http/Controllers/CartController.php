<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $restaurant = Restaurant::where('is_active', true)->first();

        return Inertia::render('Cart', [
            'restaurant' => $restaurant,
            'deliveryPrice' => $restaurant?->delivery_price ?? 0,
        ]);
    }
}
