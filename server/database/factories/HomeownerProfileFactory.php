<?php

namespace Database\Factories;

use App\Models\HomeownerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HomeownerProfileFactory extends Factory
{
    protected $model = HomeownerProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'preferred_zip' => $this->faker->postcode(),
            'address_line1' => $this->faker->streetAddress(),
            'address_line2' => $this->faker->secondaryAddress(),
            'city' => $this->faker->city(),
            'state_code' => $this->faker->stateAbbr(),
            'country_code' => $this->faker->countryCode(),
            'lat' => $this->faker->latitude(),
            'lng' => $this->faker->longitude(),
        ];
    }
}
