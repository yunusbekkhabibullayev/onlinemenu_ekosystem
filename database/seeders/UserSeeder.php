<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'employee_code' => 'ADM001',
                'is_active' => true,
            ]
        );

        // Waiter users
        $waiters = [
            ['name' => 'Ali Valiyev', 'email' => 'waiter1@example.com', 'username' => 'waiter1', 'code' => 'W001'],
            ['name' => 'Hasan Karimov', 'email' => 'waiter2@example.com', 'username' => 'waiter2', 'code' => 'W002'],
        ];

        foreach ($waiters as $waiter) {
            User::updateOrCreate(
                ['email' => $waiter['email']],
                [
                    'name' => $waiter['name'],
                    'username' => $waiter['username'],
                    'password' => Hash::make('password'),
                    'role' => 'waiter',
                    'employee_code' => $waiter['code'],
                    'is_active' => true,
                ]
            );
        }

        // Kitchen users
        $kitchen = [
            ['name' => 'Oshpaz 1', 'email' => 'kitchen1@example.com', 'username' => 'oshpaz1', 'code' => 'K001'],
            ['name' => 'Oshpaz 2', 'email' => 'kitchen2@example.com', 'username' => 'oshpaz2', 'code' => 'K002'],
        ];

        foreach ($kitchen as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'username' => $user['username'],
                    'password' => Hash::make('password'),
                    'role' => 'kitchen',
                    'employee_code' => $user['code'],
                    'is_active' => true,
                ]
            );
        }

        // Cashier users
        $cashiers = [
            ['name' => 'Kassa 1', 'email' => 'cashier1@example.com', 'username' => 'kassa1', 'code' => 'C001'],
        ];

        foreach ($cashiers as $cashier) {
            User::updateOrCreate(
                ['email' => $cashier['email']],
                [
                    'name' => $cashier['name'],
                    'username' => $cashier['username'],
                    'password' => Hash::make('password'),
                    'role' => 'cashier',
                    'employee_code' => $cashier['code'],
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Foydalanuvchilar yaratildi:');
        $this->command->info('- 1 Admin');
        $this->command->info('- ' . count($waiters) . ' Ofitsiant');
        $this->command->info('- ' . count($kitchen) . ' Oshxona');
        $this->command->info('- ' . count($cashiers) . ' Kassa');
        $this->command->info('Barcha parollar: password');
    }
}
