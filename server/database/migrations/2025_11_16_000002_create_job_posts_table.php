<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('homeowner_id');
            $table->string('title');
            $table->text('description');
            $table->date('deadline')->nullable();
            $table->string('status')->default('open');
            $table->timestamps();
            $table->foreign('homeowner_id')->references('user_id')->on('homeowner_profiles')->onDelete('cascade');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};
