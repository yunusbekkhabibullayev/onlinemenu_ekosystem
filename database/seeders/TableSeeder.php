<?php

namespace Database\Seeders;

use App\Models\Table;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class TableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurant = Restaurant::where('is_active', true)->first();

        if (!$restaurant) {
            $this->command->warn('Restaurant topilmadi. Avval RestaurantSeeder ishga tushiring.');
            return;
        }

        $tables = [
            ['number' => '1', 'name' => 'Oyna yonida', 'capacity' => 4, 'status' => 'available'],
            ['number' => '2', 'name' => null, 'capacity' => 4, 'status' => 'available'],
            ['number' => '3', 'name' => null, 'capacity' => 6, 'status' => 'available'],
            ['number' => '4', 'name' => 'Balkon', 'capacity' => 4, 'status' => 'available'],
            ['number' => '5', 'name' => null, 'capacity' => 2, 'status' => 'available'],
            ['number' => '6', 'name' => null, 'capacity' => 8, 'status' => 'available'],
            ['number' => '7', 'name' => null, 'capacity' => 4, 'status' => 'available'],
            ['number' => '8', 'name' => null, 'capacity' => 6, 'status' => 'available'],
            ['number' => 'VIP-1', 'name' => 'VIP xona', 'capacity' => 10, 'status' => 'available'],
            ['number' => 'VIP-2', 'name' => 'VIP xona', 'capacity' => 12, 'status' => 'available'],
        ];

        foreach ($tables as $tableData) {
            Table::create([
                'restaurant_id' => $restaurant->id,
                'number' => $tableData['number'],
                'name' => $tableData['name'],
                'capacity' => $tableData['capacity'],
                'status' => $tableData['status'],
                'is_active' => true,
            ]);
        }

        $this->command->info('Stollar yaratildi: ' . count($tables) . ' ta');
    }
}
