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
        Schema::create('contratos', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->primary();
            $table->string('preferred_zip', 15)->nullable();
            $table->string('address_line1', 200)->nullable();
            $table->string('address_line2', 200)->nullable();
            $table->string('city', 120)->nullable();
            $table->string('state_code', 10)->nullable();
            $table->string('country_code', 2)->default('US')->notNull();
            $table->decimal('lat', 9, 6)->nullable();
            $table->decimal('lng', 9, 6)->nullable();
            
            // Campos adicionales solicitados
            $table->string('mobile_number', 20)->nullable()->comment('Número de celular');
            $table->string('phone_number', 20)->nullable()->comment('Número de teléfono fijo');
            $table->boolean('has_driving_license')->default(false)->comment('Si tiene licencia de conducir');
            $table->string('driving_license_category', 10)->nullable()->comment('Categoría de licencia de conducir');
            $table->string('linkedin_url', 500)->nullable()->comment('URL de LinkedIn');
            $table->string('portfolio_url', 500)->nullable()->comment('URL de portafolio personal');
            
            // Fechas de afiliación y aprobación
            $table->date('affiliation_date')->nullable()->comment('Fecha de afiliación');
            $table->date('approval_date')->nullable()->comment('Fecha de aprobación del contrato');
            $table->enum('contract_status', ['pendiente', 'aprobado', 'rechazado', 'suspendido'])->default('pendiente')->comment('Estado del contrato');
            
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contratos');
    }
};
