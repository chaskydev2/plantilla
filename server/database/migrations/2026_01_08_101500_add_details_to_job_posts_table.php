<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->unsignedBigInteger('service_id')->nullable()->after('homeowner_id');
            $table->decimal('price', 12, 2)->nullable()->after('status');
            $table->string('currency', 3)->default('USD')->after('price');
            $table->string('address_line1', 200)->nullable()->after('currency');
            $table->string('address_line2', 200)->nullable()->after('address_line1');
            $table->string('city', 120)->nullable()->after('address_line2');
            $table->string('state_code', 10)->nullable()->after('city');
            $table->string('postal_code', 15)->nullable()->after('state_code');
            $table->decimal('lat', 9, 6)->nullable()->after('postal_code');
            $table->decimal('lng', 9, 6)->nullable()->after('lat');
            $table->string('image_path')->nullable()->after('lng');

            $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
            $table->dropColumn([
                'service_id',
                'price',
                'currency',
                'address_line1',
                'address_line2',
                'city',
                'state_code',
                'postal_code',
                'lat',
                'lng',
                'image_path',
            ]);
        });
    }
};
