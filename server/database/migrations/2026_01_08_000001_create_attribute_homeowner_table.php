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
        Schema::create('attribute_homeowner', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('homeowner_id');
            $table->unsignedBigInteger('attribute_id');
            $table->string('value')->nullable();
            $table->text('coment')->nullable();
            $table->boolean('status')->default(0);
            $table->timestamps();

            $table->foreign('homeowner_id')->references('user_id')->on('homeowner_profiles')->onDelete('cascade');
            $table->foreign('attribute_id')->references('id')->on('attributes')->onDelete('cascade');

            $table->unique(['homeowner_id', 'attribute_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_homeowner');
    }
};
