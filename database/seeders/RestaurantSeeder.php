<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use App\Models\Category;
use App\Models\FoodItem;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Restaurant
        $restaurant = Restaurant::create([
            'name' => 'Table Talk',
            'description' => 'Mazali taomlar va qulay muhit',
            'address' => 'Toshkent sh., Chilonzor tumani, 1-mavze',
            'phone' => '+998 90 123 45 67',
            'working_hours' => '09:00 - 22:00',
            'delivery_price' => 15000,
            'instagram' => 'https://instagram.com/tabletalk',
            'telegram' => 'https://t.me/tabletalk',
            'is_active' => true,
        ]);

        // Create Categories
        $categories = [
            ['name' => 'Salatlar', 'order' => 1],
            ['name' => 'Sho\'rvalar', 'order' => 2],
            ['name' => 'Asosiy taomlar', 'order' => 3],
            ['name' => 'Kaboblar', 'order' => 4],
            ['name' => 'Ichimliklar', 'order' => 5],
            ['name' => 'Shirinliklar', 'order' => 6],
        ];

        foreach ($categories as $categoryData) {
            Category::create([
                'restaurant_id' => $restaurant->id,
                'name' => $categoryData['name'],
                'order' => $categoryData['order'],
                'is_active' => true,
            ]);
        }

        // Create Food Items
        $foods = [
            // Salatlar
            ['category' => 'Salatlar', 'name' => 'Sezar salati', 'description' => 'Tovuq go\'shti, parmezn, krutonar', 'price' => 35000],
            ['category' => 'Salatlar', 'name' => 'Olivye', 'description' => 'An\'anaviy rus salati', 'price' => 28000],
            ['category' => 'Salatlar', 'name' => 'Yunoncha salat', 'description' => 'Pomidor, bodring, zaytun', 'price' => 32000],

            // Sho'rvalar
            ['category' => 'Sho\'rvalar', 'name' => 'Mastava', 'description' => 'Go\'shtli guruch sho\'rvasi', 'price' => 25000],
            ['category' => 'Sho\'rvalar', 'name' => 'Lag\'mon sho\'rvasi', 'description' => 'Uyg\'urcha lag\'mon', 'price' => 30000],
            ['category' => 'Sho\'rvalar', 'name' => 'Shurpa', 'description' => 'Qo\'y go\'shtidan tayyorlangan', 'price' => 35000],

            // Asosiy taomlar
            ['category' => 'Asosiy taomlar', 'name' => 'Palov', 'description' => 'Toshkent palovi', 'price' => 40000],
            ['category' => 'Asosiy taomlar', 'name' => 'Lag\'mon', 'description' => 'Qo\'l lag\'moni', 'price' => 35000],
            ['category' => 'Asosiy taomlar', 'name' => 'Manti', 'description' => '5 dona', 'price' => 30000],
            ['category' => 'Asosiy taomlar', 'name' => 'Chuchvara', 'description' => 'Qaymoq bilan', 'price' => 28000],

            // Kaboblar
            ['category' => 'Kaboblar', 'name' => 'Qo\'y kabob', 'description' => '100g', 'price' => 45000],
            ['category' => 'Kaboblar', 'name' => 'Tovuq kabob', 'description' => '100g', 'price' => 30000],
            ['category' => 'Kaboblar', 'name' => 'Jigar kabob', 'description' => '100g', 'price' => 25000],
            ['category' => 'Kaboblar', 'name' => 'Lyulya kabob', 'description' => '100g', 'price' => 35000],

            // Ichimliklar
            ['category' => 'Ichimliklar', 'name' => 'Kompot', 'description' => 'Uy tayyorlovi', 'price' => 10000],
            ['category' => 'Ichimliklar', 'name' => 'Limonad', 'description' => 'Yangi tayyorlangan', 'price' => 15000],
            ['category' => 'Ichimliklar', 'name' => 'Choy', 'description' => 'Qora yoki ko\'k', 'price' => 8000],
            ['category' => 'Ichimliklar', 'name' => 'Ayran', 'description' => '0.5L', 'price' => 12000],

            // Shirinliklar
            ['category' => 'Shirinliklar', 'name' => 'Medovik', 'description' => 'Asalli tort', 'price' => 25000],
            ['category' => 'Shirinliklar', 'name' => 'Tiramisu', 'description' => 'Italyan shirinligi', 'price' => 30000],
            ['category' => 'Shirinliklar', 'name' => 'Baklava', 'description' => 'Turk shirrinligi', 'price' => 20000],
        ];

        foreach ($foods as $foodData) {
            $category = Category::where('name', $foodData['category'])->first();
            if ($category) {
                FoodItem::create([
                    'category_id' => $category->id,
                    'name' => $foodData['name'],
                    'description' => $foodData['description'],
                    'price' => $foodData['price'],
                    'is_available' => true,
                    'order' => 0,
                ]);
            }
        }
    }
}
