<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('scam_alerts', function (Blueprint $table) {
            $table->id();

            // Relación opcional con contractor (user_id) y homeowner profile (user_id)
            $table->unsignedBigInteger('contractor_id')->nullable();
            $table->unsignedBigInteger('homeowner_profile_id')->nullable();

            // Empresa
            $table->string('business_name');
            $table->string('legal_name')->nullable();
            $table->string('business_owner')->nullable();

            // Ubicaciones
            $table->json('operating_states')->nullable();
            $table->string('complaint_location')->nullable();

            // Información del conflicto
            $table->decimal('amount_in_dispute', 10, 2)->nullable();
            $table->unsignedInteger('complaints_count')->default(1);

            // Detalles del reporte
            $table->text('reason_for_listing');
            $table->text('business_response')->nullable();

            // Fechas
            $table->date('reported_at');

            // Estado del alert
            $table->enum('status', ['active', 'resolved', 'closed'])->default('active');

            $table->timestamps();

            $table->foreign('contractor_id')
                ->references('user_id')
                ->on('contractors')
                ->nullOnDelete();

            $table->foreign('homeowner_profile_id')
                ->references('user_id')
                ->on('homeowner_profiles')
                ->nullOnDelete();

            $table->index(['contractor_id', 'homeowner_profile_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scam_alerts');
    }
};
