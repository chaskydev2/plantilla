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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('ci')->nullable()->after('last_name');
            $table->string('registration_code')->unique()->nullable()->after('ci');
            $table->text('address')->nullable()->after('registration_code');
            $table->string('mobile_number')->nullable()->after('address');
            $table->string('phone_number')->nullable()->after('mobile_number');
            $table->boolean('edit_profile')->default(false);
            $table->boolean('verification')->default(false)->after('edit_profile');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'ci',
                'registration_code',
                'address',
                'mobile_number',
                'phone_number',
                'college_affiliation_date',
                'linkedin_url',
                'portfolio_url',
                'professional_summary',
                'travel_availability',
                'has_driving_license',
                'driving_license_category',
                'edit_profile',
            ]);
        });
    }
};
