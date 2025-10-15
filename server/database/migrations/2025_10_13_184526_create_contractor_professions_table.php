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
        Schema::create('contractor_professions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contractor_user_id'); 
            $table->unsignedBigInteger('profession_id');
            $table->timestamps();

            // Referencia a la tabla contractors
            $table->foreign('contractor_user_id')->references('user_id')->on('contractors')->onDelete('cascade');
            $table->foreign('profession_id')->references('id')->on('professions')->onDelete('cascade');
            
            $table->unique(['contractor_user_id', 'profession_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contractor_professions');
    }
};
