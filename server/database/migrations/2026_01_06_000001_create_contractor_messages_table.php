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
        Schema::create('contractor_messages', function (Blueprint $table) {
            $table->bigIncrements('id');

            // Relación con el contractor (siempre obligatorio)
            $table->unsignedBigInteger('contractor_user_id');

            // Tipo de remitente: 'user', 'guest', 'system', etc.
            $table->string('sender_type', 50)->default('guest');

            // Si el remitente es un usuario registrado
            $table->unsignedBigInteger('sender_user_id')->nullable();

            // Si el remitente es invitado (sin usuario en el sistema)
            $table->string('guest_name')->nullable();
            $table->string('guest_email')->nullable();

            // Contenido principal del mensaje
            $table->text('message')->nullable();

            // Campos adicionales para adjuntos y metadata
            $table->json('attachments')->nullable(); // para URLs de imágenes, documentos, etc.
            $table->json('links')->nullable();       // para guardar uno o varios links relacionados

            // Estado del mensaje (enviado, leído, archivado, etc.)
            $table->string('status', 50)->default('sent');

            $table->timestamps();

            // Índices y claves foráneas
            $table->foreign('contractor_user_id')
                ->references('user_id')
                ->on('contractors')
                ->onDelete('cascade');

            $table->foreign('sender_user_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            $table->index(['contractor_user_id', 'sender_type']);
            $table->index('sender_user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contractor_messages');
    }
};
