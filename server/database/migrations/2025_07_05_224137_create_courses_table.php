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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('modality');
            $table->string('location')->nullable();
            $table->decimal('cost', 10, 2)->default(0.00);
            $table->unsignedInteger('max_capacity');
            $table->string('status')->default('planned');
            $table->boolean('has_certificate')->default(false);
            $table->boolean('attendance_tracking')->default(true);

            $table->unsignedBigInteger('instructor_id')->nullable();
            $table->foreign('instructor_id')->references('id')->on('users')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
