<?php

namespace Database\Factories;

use App\Models\Contrato;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contrato>
 */
class ContratoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Contrato::class;

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
            'license_number' => strtoupper($this->faker->unique()->bothify('LIC-##???##')),
            'is_insured' => $this->faker->boolean(70),
            'service_area' => $this->faker->randomElement([
                'Plomería', 'Electricidad', 'Carpintería', 'Pintura', 
                'Jardinería', 'Limpieza', 'Construcción', 'Reparaciones'
            ]),
            'average_rating' => $this->faker->randomFloat(2, 0, 5),
            'state_code' => $this->faker->optional(0.8)->stateAbbr(),
            'country_code' => $this->faker->countryCode(),
            'lat' => $this->faker->latitude(-22.0, -9.0), // Bolivia coordinates range
            'lng' => $this->faker->longitude(-69.0, -57.0),
            'mobile_number' => $this->faker->phoneNumber(),
            'phone_number' => $this->faker->optional(0.6)->phoneNumber(),
            'has_driving_license' => $this->faker->boolean(80),
            'driving_license_category' => $this->faker->optional(0.8)->randomElement(['A', 'B', 'C', 'D']),
            'linkedin_url' => $this->faker->optional(0.4)->url(),
            'portfolio_url' => $this->faker->optional(0.3)->url(),
            'affiliation_date' => $this->faker->optional(0.9)->dateTimeBetween('-2 years', 'now'),
            'approval_date' => $this->faker->optional(0.7)->dateTimeBetween('-1 year', 'now'),
            'contract_status' => $this->faker->randomElement(['pendiente', 'aprobado', 'rechazado', 'suspendido']),
        ];
    }

    /**
     * Indicate that the contract is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'contract_status' => 'aprobado',
            'approval_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ]);
    }

    /**
     * Indicate that the contract is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'contract_status' => 'pendiente',
            'approval_date' => null,
        ]);
    }

    /**
     * Indicate that the contract is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'contract_status' => 'rechazado',
            'approval_date' => null,
        ]);
    }

    /**
     * Indicate that the contract is suspended.
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'contract_status' => 'suspendido',
        ]);
    }

    /**
     * Indicate that the contractor is insured.
     */
    public function insured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_insured' => true,
        ]);
    }

    /**
     * Indicate that the contractor is not insured.
     */
    public function notInsured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_insured' => false,
        ]);
    }

    /**
     * Indicate that the contractor has a driving license.
     */
    public function withDrivingLicense(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_driving_license' => true,
            'driving_license_category' => $this->faker->randomElement(['A', 'B', 'C', 'D']),
        ]);
    }

    /**
     * Indicate that the contractor doesn't have a driving license.
     */
    public function withoutDrivingLicense(): static
    {
        return $this->state(fn (array $attributes) => [
            'has_driving_license' => false,
            'driving_license_category' => null,
        ]);
    }

    /**
     * Indicate high rating.
     */
    public function highRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'average_rating' => $this->faker->randomFloat(2, 4.0, 5.0),
        ]);
    }

    /**
     * Indicate low rating.
     */
    public function lowRating(): static
    {
        return $this->state(fn (array $attributes) => [
            'average_rating' => $this->faker->randomFloat(2, 0.0, 2.5),
        ]);
    }

    /**
     * Set specific service area.
     */
    public function serviceArea(string $area): static
    {
        return $this->state(fn (array $attributes) => [
            'service_area' => $area,
        ]);
    }

    /**
     * Set specific city.
     */
    public function inCity(string $city): static
    {
        return $this->state(fn (array $attributes) => [
            'city' => $city,
        ]);
    }

    /**
     * Set coordinates for specific location.
     */
    public function atLocation(float $lat, float $lng): static
    {
        return $this->state(fn (array $attributes) => [
            'lat' => $lat,
            'lng' => $lng,
        ]);
    }
}