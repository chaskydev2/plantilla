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
        Schema::create('job_contractor', function (Blueprint $table) {
            $table->id();
            
            // Relationships
            $table->unsignedBigInteger('id_creator')->comment('User who creates the job (required)');
            $table->unsignedBigInteger('id_homeowner')->nullable()->comment('Associated homeowner (optional)');
            
            // Main fields
            $table->string('title')->comment('Job title');
            $table->text('description')->nullable()->comment('Detailed job description');
            $table->string('location')->comment('Job location');
            $table->string('service_type')->comment('Service type (e.g: Roofing, Plumbing)');
            
            // Image and URL
            $table->string('image_url')->nullable()->comment('Job image URL');
            $table->string('url')->nullable()->comment('Additional URL or related link');
            
            // Optional data
            $table->decimal('amount_paid', 10, 2)->nullable()->comment('Amount paid (if applicable)');
            $table->boolean('is_active')->default(true)->comment('Job is active or inactive');
            $table->text('comment')->nullable()->comment('Comment about the job');
            $table->date('job_date')->nullable()->comment('Job date');
            
            // Timestamps
            $table->timestamps();
            
            // Indexes for searches and performance
            $table->index('id_creator');
            $table->index('id_homeowner');
            $table->index('service_type');
            $table->index('created_at');
            
            // Foreign keys
            $table->foreign('id_creator')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
                
            $table->foreign('id_homeowner')
                ->references('user_id')
                ->on('homeowner_profiles')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_contractor');
    }
};
