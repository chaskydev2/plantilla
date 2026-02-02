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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('homeowner_profile_id')->comment('ID del usuario HomeownerProfile que da la calificación');
            $table->unsignedBigInteger('contractor_id')->comment('ID del usuario Contractor que recibe la calificación');
            $table->tinyInteger('rating')->comment('Calificación de 1 a 5 estrellas');
            $table->text('comment')->nullable()->comment('Comentario opcional sobre la calificación');
            $table->timestamps();

            // Índices
            $table->index('homeowner_profile_id');
            $table->index('contractor_id');
            $table->index('rating');
            
            // Un HomeownerProfile solo puede calificar una vez a un Contractor
            $table->unique(['homeowner_profile_id', 'contractor_id'], 'unique_review_per_homeowner_contractor');

            // Foreign keys
            $table->foreign('homeowner_profile_id')
                ->references('user_id')
                ->on('homeowner_profiles')
                ->onDelete('cascade');

            $table->foreign('contractor_id')
                ->references('user_id')
                ->on('contractors')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
