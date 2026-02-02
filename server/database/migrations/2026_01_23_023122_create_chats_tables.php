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
        // Tabla para los hilos de conversación entre contractor y homeowner
        Schema::create('chat_threads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contractor_id');
            $table->unsignedBigInteger('homeowner_profile_id');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->foreign('contractor_id')
                ->references('user_id')
                ->on('contractors')
                ->onDelete('cascade');

            $table->foreign('homeowner_profile_id')
                ->references('user_id')
                ->on('homeowner_profiles')
                ->onDelete('cascade');

            // Índice único para evitar conversaciones duplicadas
            $table->unique(['contractor_id', 'homeowner_profile_id']);
        });

        // Tabla para los mensajes individuales
        Schema::create('chat_messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chat_thread_id');
            $table->morphs('sender'); // sender_type y sender_id
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->foreign('chat_thread_id')
                ->references('id')
                ->on('chat_threads')
                ->onDelete('cascade');

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_messages');
        Schema::dropIfExists('chat_threads');
    }
};
