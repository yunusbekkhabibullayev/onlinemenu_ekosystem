<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->index('is_available', 'food_items_is_available_idx');
            $table->index('order', 'food_items_order_idx');
            $table->index(['is_available', 'category_id', 'order'], 'food_items_available_category_order_idx');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index('is_active', 'categories_is_active_idx');
            $table->index('order', 'categories_order_idx');
            $table->index(['is_active', 'restaurant_id', 'order'], 'categories_active_restaurant_order_idx');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->index('is_active', 'restaurants_is_active_idx');
        });
    }

    public function down(): void
    {
        Schema::table('food_items', function (Blueprint $table) {
            $table->dropIndex('food_items_is_available_idx');
            $table->dropIndex('food_items_order_idx');
            $table->dropIndex('food_items_available_category_order_idx');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_is_active_idx');
            $table->dropIndex('categories_order_idx');
            $table->dropIndex('categories_active_restaurant_order_idx');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropIndex('restaurants_is_active_idx');
        });
    }
};
