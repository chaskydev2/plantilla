<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contractor_team_members', function (Blueprint $table) {
            $table->unsignedBigInteger('leader_user_id');
            $table->unsignedBigInteger('member_user_id');
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');
            $table->string('compania', 255)->nullable();

            $table->primary(['leader_user_id', 'member_user_id']);

            $table->foreign('leader_user_id')
                ->references('user_id')
                ->on('contractors')
                ->onDelete('cascade');

            $table->foreign('member_user_id')
                ->references('user_id')
                ->on('contractors')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contractor_team_members');
    }
};
