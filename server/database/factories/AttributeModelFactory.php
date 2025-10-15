<?php

namespace Database\Factories;

use App\Models\AttributeModel;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttributeModel>
 */
class AttributeModelFactory extends Factory
{
    protected $model = AttributeModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $attributes = [
            'Experiencia Laboral',
            'Certificaciones',
            'Disponibilidad',
            'Idiomas',
            'Especialización',
            'Años de Experiencia',
            'Herramientas',
            'Equipos',
            'Licencias',
            'Seguros',
            'Referencias',
            'Portafolio',
            'Ubicación de Trabajo',
            'Horario de Trabajo',
            'Tarifa por Hora',
            'Tipo de Servicio',
            'Área de Cobertura',
            'Calificación Promedio',
            'Número de Proyectos',
            'Tiempo de Respuesta'
        ];

        $name = $this->faker->randomElement($attributes);
        $slug = Str::slug($name);

        return [
            'name' => $name,
            'slug' => $slug,
            'description' => $this->faker->paragraph(2),
            'required_for' => $this->faker->randomElement([
                AttributeModel::REQUIRED_FOR_HOMEOWNER,
                AttributeModel::REQUIRED_FOR_CONTRACTOR,
                AttributeModel::REQUIRED_FOR_BOTH
            ]),
        ];
    }

    /**
     * Indicate that the attribute is for homeowners.
     */
    public function forHomeowner(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER,
            ];
        });
    }

    /**
     * Indicate that the attribute is for contractors.
     */
    public function forContractor(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR,
            ];
        });
    }

    /**
     * Indicate that the attribute is for both.
     */
    public function forBoth(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH,
            ];
        });
    }

    /**
     * Create an attribute with a specific name.
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