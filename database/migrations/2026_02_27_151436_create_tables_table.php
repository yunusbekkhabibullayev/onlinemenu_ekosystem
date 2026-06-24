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
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->string('number'); // Stol raqami: "1", "2", "VIP-1"
            $table->string('name')->nullable(); // "Oyna yonida", "Balkon"
            $table->integer('capacity')->default(4); // Sig'im: 4, 6, 8
            $table->enum('status', ['available', 'occupied', 'reserved', 'cleaning'])->default('available');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['restaurant_id', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};
