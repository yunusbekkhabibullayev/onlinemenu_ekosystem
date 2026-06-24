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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('table_id')->nullable()->after('restaurant_id')->constrained()->onDelete('set null');
            $table->foreignId('order_session_id')->nullable()->after('table_id')->constrained()->onDelete('set null');
            $table->foreignId('waiter_id')->nullable()->after('order_session_id')->constrained('users')->onDelete('set null');
            $table->string('customer_name')->nullable()->after('phone');
            
            // Status yangilash: 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'paid'
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'paid', 'cancelled'])->default('pending')->change();
            
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid')->after('status');
            $table->enum('payment_method', ['cash', 'card', 'online'])->nullable()->after('payment_status');
            $table->timestamp('paid_at')->nullable()->after('payment_method');
            $table->timestamp('ready_at')->nullable()->after('paid_at');
            $table->timestamp('delivered_at')->nullable()->after('ready_at');
            $table->boolean('is_additional')->default(false)->after('delivered_at');
            $table->foreignId('parent_order_id')->nullable()->after('is_additional')->constrained('orders')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['table_id']);
            $table->dropForeign(['order_session_id']);
            $table->dropForeign(['waiter_id']);
            $table->dropForeign(['parent_order_id']);
            $table->dropColumn([
                'table_id',
                'order_session_id',
                'waiter_id',
                'customer_name',
                'payment_status',
                'payment_method',
                'paid_at',
                'ready_at',
                'delivered_at',
                'is_additional',
                'parent_order_id',
            ]);
            // Status ni eski holatiga qaytarish
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'])->default('pending')->change();
        });
    }
};
