<?php

namespace Database\Seeders;

use App\Models\Contractor;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContractorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 contractors with approved status
        Contractor::factory()
            ->count(50)
            ->approved()
            ->highRating()
            ->insured()
            ->create();

        // Create 20 pending contractors
        Contractor::factory()
            ->count(20)
            ->pending()
            ->create();

        // Create 10 rejected contractors
        Contractor::factory()
            ->count(10)
            ->rejected()
            ->create();

        // Create 5 suspended contractors
        Contractor::factory()
            ->count(5)
            ->suspended()
            ->create();

        // Create contractors in specific cities
        $cities = ['La Paz', 'Santa Cruz', 'Cochabamba', 'Sucre', 'Potosí'];
        
        foreach ($cities as $city) {
            Contractor::factory()
                ->count(5)
                ->approved()
                ->inCity($city)
                ->create();
        }

        // Create a specific contractor for testing
        $testUser = User::factory()->create([
            'name' => 'Juan Pérez',
            'first_name' => 'Juan',
            'last_name' => 'Pérez',
            'email' => 'contractor@test.com',
            'verification' => true,
        ]);

        Contractor::factory()->create([
            'user_id' => $testUser->id,
            'company_name' => 'Construcciones Pérez',
            'license_number' => 'LIC-2024-TEST',
            'is_insured' => true,
            'service_area' => 'Construcción General',
            'average_rating' => 4.8,
            'city' => 'La Paz',
            'contract_status' => Contractor::STATUS_APPROVED,
            'has_driving_license' => true,
            'driving_license_category' => 'B',
            'affiliation_date' => now()->subMonths(6),
            'approval_date' => now()->subMonths(5),
        ]);
    }
}