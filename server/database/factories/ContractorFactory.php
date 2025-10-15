<?php

namespace Database\Factories;

use App\Models\Contractor;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contractor>
 */
class ContractorFactory extends Factory
{
    protected $model = Contractor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'preferred_zip' => $this->faker->postcode(),
            'address_line1' => $this->faker->streetAddress(),
            'address_line2' => $this->faker->optional(0.3)->secondaryAddress(),
            'city' => $this->faker->city(),
            'company_name' => $this->faker->company(),
            'license_number' => strtoupper($this->faker->unique()->bothify('LIC-####-??##')),
            'is_insured' => $this->faker->boolean(80), // 80% probability of being insured
            'service_area' => $this->faker->randomElement([
                'Construcción Residencial',
                'Construcción Comercial',
                'Electricidad',
                'Plomería',
                'Carpintería',
                'Pintura y Decoración',
                'Jardinería y Paisajismo',
                'Techado',
                'Aire Acondicionado',
                'Seguridad'
            ]),
            'average_rating' => $this->faker->randomFloat(2, 0, 5),
            'state_code' => $this->faker->stateAbbr(),
            'country_code' => $this->faker->randomElement(['US', 'CA', 'MX', 'BO']),
            'lat' => $this->faker->latitude(),
            'lng' => $this->faker->longitude(),
            'mobile_number' => $this->faker->phoneNumber(),
            'phone_number' => $this->faker->optional(0.7)->phoneNumber(),
            'has_driving_license' => $this->faker->boolean(85), // 85% have driving license
            'driving_license_category' => $this->faker->optional(0.85)->randomElement(['A', 'B', 'C', 'D']),
            'linkedin_url' => $this->faker->optional(0.6)->url(),
            'portfolio_url' => $this->faker->optional(0.4)->url(),
            'affiliation_date' => $this->faker->dateTimeBetween('-2 years', 'now'),
            'approval_date' => $this->faker->optional(0.8)->dateTimeBetween('-1 year', 'now'),
            'contract_status' => $this->faker->randomElement([
                Contractor::STATUS_PENDING,
                Contractor::STATUS_APPROVED,
                Contractor::STATUS_REJECTED,
                Contractor::STATUS_SUSPENDED
            ]),
        ];
    }

    /**
     * Indicate that the contractor is approved.
     */
    public function approved(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'contract_status' => Contractor::STATUS_APPROVED,
                'approval_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            ];
        });
    }

    /**
     * Indicate that the contractor is pending.
     */
    public function pending(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'contract_status' => Contractor::STATUS_PENDING,
                'approval_date' => null,
            ];
        });
    }

    /**
     * Indicate that the contractor is rejected.
     */
    public function rejected(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'contract_status' => Contractor::STATUS_REJECTED,
                'approval_date' => null,
            ];
        });
    }

    /**
     * Indicate that the contractor is suspended.
     */
    public function suspended(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'contract_status' => Contractor::STATUS_SUSPENDED,
            ];
        });
    }

    /**
     * Indicate that the contractor is insured.
     */
    public function insured(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'is_insured' => true,
            ];
        });
    }

    /**
     * Indicate that the contractor has a high rating.
     */
    public function highRating(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'average_rating' => $this->faker->randomFloat(2, 4.0, 5.0),
            ];
        });
    }

    /**
     * Indicate that the contractor is from a specific city.
     */
    public function inCity(string $city): static
    {
        return $this->state(function (array $attributes) use ($city) {
            return [
                'city' => $city,
            ];
        });
    }
}