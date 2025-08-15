<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            $table->string('company_name');
            $table->string('company_location');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('position');
            $table->text('responsibilities');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('work_experiences');
    }
};
