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
        Schema::create('attribute_contractor', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('contractor_id');
            $table->unsignedBigInteger('attribute_id');
            $table->string('value')->nullable(); // Para guardar el valor/documento del atributo si aplica
            $table->text('coment')->default(''); // Comentario asociado, por defecto vacío
            $table->boolean('status')->default(0); // 0 = desactivado, 1 = activado
            $table->timestamps();

            $table->foreign('contractor_id')->references('user_id')->on('contractors')->onDelete('cascade');
            $table->foreign('attribute_id')->references('id')->on('attributes')->onDelete('cascade');

            $table->unique(['contractor_id', 'attribute_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_contractor');
    }
};
