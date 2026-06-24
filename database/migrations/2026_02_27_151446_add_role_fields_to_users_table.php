<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Role ni yangilash: 'admin', 'waiter', 'kitchen', 'cashier', 'user'
            $table->enum('role', ['admin', 'waiter', 'kitchen', 'cashier', 'user'])->default('user')->change();
            $table->string('employee_code')->nullable()->after('role'); // "W001", "K001"
            $table->boolean('is_active')->default(true)->after('employee_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['user', 'admin'])->default('user')->change();
            $table->dropColumn(['employee_code', 'is_active']);
        });
    }
};
