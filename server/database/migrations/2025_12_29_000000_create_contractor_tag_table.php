<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contractor_tag', function (Blueprint $table) {
            $table->unsignedBigInteger('contractor_user_id');
            $table->unsignedBigInteger('tag_id');
            $table->primary(['contractor_user_id', 'tag_id']);

            $table->foreign('contractor_user_id')
                ->references('user_id')->on('contractors')
                ->onDelete('cascade');
            $table->foreign('tag_id')
                ->references('id')->on('tags')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contractor_tag');
    }
};
