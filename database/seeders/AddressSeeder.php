<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $restaurant = Restaurant::first();
        if (!$restaurant) return;

        $addresses = [
            ['street' => "O'zbekiston ko'chasi, 22B", 'city' => 'Nukus', 'district' => '22-kichik nohiya', 'latitude' => 42.4531, 'longitude' => 59.6102],
            ['street' => "Do'stlik ko'chasi, 15", 'city' => "Jizzax", 'district' => "Do'stlik tumani", 'latitude' => 40.1158, 'longitude' => 67.8422],
            ['street' => 'Park ko\'chasi, 1', 'city' => "Jizzax", 'district' => "Do'stlik tumani", 'latitude' => 40.1167, 'longitude' => 67.8411],
        ];

        foreach ($addresses as $i => $addr) {
            Address::updateOrCreate(
                ['restaurant_id' => $restaurant->id, 'street' => $addr['street']],
                array_merge($addr, ['order' => $i + 1])
            );
        }
    }
}
