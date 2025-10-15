<?php

namespace Database\Factories;

use App\Models\Profession;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profession>
 */
class ProfessionFactory extends Factory
{
    protected $model = Profession::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $professions = [
            'Ingeniero Civil',
            'Arquitecto',
            'Electricista',
            'Plomero',
            'Carpintero',
            'Albañil',
            'Pintor',
            'Soldador',
            'Mecánico',
            'Técnico en Refrigeración',
            'Jardinero',
            'Diseñador de Interiores',
            'Ingeniero Eléctrico',
            'Técnico en Sistemas',
            'Contador',
            'Abogado',
            'Médico',
            'Enfermero',
            'Profesor',
            'Chef',
            'Fotógrafo',
            'Desarrollador Web',
            'Diseñador Gráfico',
            'Marketing Digital',
            'Consultor',
            'Veterinario',
            'Psicólogo',
            'Fisioterapeuta',
            'Nutricionista',
            'Personal Trainer'
        ];

        $name = $this->faker->randomElement($professions);
        $slug = Str::slug($name);

        return [
            'name' => $name,
            'slug' => $slug,
            'description' => $this->faker->paragraph(3),
        ];
    }

    /**
     * Indicate that the profession is related to construction.
     */
    public function construction(): static
    {
        $constructionProfessions = [
            'Ingeniero Civil',
            'Arquitecto',
            'Albañil',
            'Carpintero',
            'Electricista',
            'Plomero',
            'Pintor',
            'Soldador',
            'Técnico en Refrigeración'
        ];

        return $this->state(function (array $attributes) use ($constructionProfessions) {
            $name = $this->faker->randomElement($constructionProfessions);
            return [
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $this->faker->paragraph(2) . ' Especializado en el sector de la construcción.',
            ];
        });
    }

    /**
     * Indicate that the profession is related to technology.
     */
    public function technology(): static
    {
        $techProfessions = [
            'Desarrollador Web',
            'Diseñador Gráfico',
            'Técnico en Sistemas',
            'Ingeniero de Software',
            'Especialista en Marketing Digital',
            'Consultor IT',
            'Analista de Datos'
        ];

        return $this->state(function (array $attributes) use ($techProfessions) {
            $name = $this->faker->randomElement($techProfessions);
            return [
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $this->faker->paragraph(2) . ' Especializado en tecnología e innovación.',
            ];
        });
    }

    /**
     * Indicate that the profession is related to healthcare.
     */
    public function healthcare(): static
    {
        $healthProfessions = [
            'Médico General',
            'Enfermero',
            'Fisioterapeuta',
            'Psicólogo',
            'Nutricionista',
            'Dentista',
            'Veterinario'
        ];

        return $this->state(function (array $attributes) use ($healthProfessions) {
            $name = $this->faker->randomElement($healthProfessions);
            return [
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $this->faker->paragraph(2) . ' Especializado en el área de la salud.',
            ];
        });
    }

    /**
     * Create a profession with a specific name.
     */
    public function withName(string $name): static
    {
        return $this->state(function (array $attributes) use ($name) {
            return [
                'name' => $name,
                'slug' => Str::slug($name),
            ];
        });
    }
}