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
        Schema::create('contractor_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contractor_user_id');
            $table->unsignedBigInteger('category_id');
            $table->timestamps();

            // Foreign keys
            $table->foreign('contractor_user_id')
                ->references('user_id')
                ->on('contractors')
                ->onDelete('cascade');

            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');

            // Avoid duplicates per contractor-category
            $table->unique(['contractor_user_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contractor_categories');
    }
};
