<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('homeowner_profile_service', function (Blueprint $table) {
            $table->unsignedBigInteger('homeowner_profile_id');
            $table->unsignedBigInteger('service_id');
            $table->timestamps();

            $table->primary(['homeowner_profile_id', 'service_id']);
            $table->foreign('homeowner_profile_id')
                ->references('user_id')
                ->on('homeowner_profiles')
                ->onDelete('cascade');
            $table->foreign('service_id')
                ->references('id')
                ->on('services')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('homeowner_profile_service');
    }
};
