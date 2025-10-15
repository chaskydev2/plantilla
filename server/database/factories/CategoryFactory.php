<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Construcción',
            'Tecnología',
            'Salud',
            'Educación',
            'Servicios del Hogar',
            'Automotriz',
            'Belleza y Estética',
            'Gastronomía',
            'Arte y Diseño',
            'Deportes y Fitness',
            'Música y Entretenimiento',
            'Consultoría',
            'Legal',
            'Finanzas',
            'Marketing',
            'Fotografía',
            'Eventos',
            'Turismo',
            'Agricultura',
            'Seguridad'
        ];

        $name = $this->faker->randomElement($categories);
        $slug = Str::slug($name);

        return [
            'name' => $name,
            'slug' => $slug,
            'parent_id' => null, // Por defecto, será una categoría padre
            'description' => $this->faker->paragraph(2),
            'icon' => $this->faker->optional(0.7)->randomElement([
                'fas fa-hammer',
                'fas fa-laptop-code',
                'fas fa-heartbeat',
                'fas fa-graduation-cap',
                'fas fa-home',
                'fas fa-car',
                'fas fa-cut',
                'fas fa-utensils',
                'fas fa-paint-brush',
                'fas fa-dumbbell',
                'fas fa-music',
                'fas fa-handshake',
                'fas fa-balance-scale',
                'fas fa-chart-line',
                'fas fa-bullhorn',
                'fas fa-camera',
                'fas fa-calendar-alt',
                'fas fa-plane',
                'fas fa-seedling',
                'fas fa-shield-alt'
            ]),
        ];
    }

    /**
     * Indicate that the category is a parent category.
     */
    public function parent(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'parent_id' => null,
            ];
        });
    }

    /**
     * Indicate that the category is a child of another category.
     */
    public function child(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'parent_id' => Category::factory()->parent(),
            ];
        });
    }

    /**
     * Create a category with a specific parent.
     */
    public function withParent(Category $parent): static
    {
        return $this->state(function (array $attributes) use ($parent) {
            return [
                'parent_id' => $parent->id,
            ];
        });
    }

    /**
     * Create construction-related categories.
     */
    public function construction(): static
    {
        $constructionCategories = [
            'Construcción Residencial',
            'Construcción Comercial',
            'Renovaciones',
            'Albañilería',
            'Carpintería',
            'Electricidad',
            'Plomería',
            'Pintura',
            'Techado',
            'Paisajismo'
        ];

        return $this->state(function (array $attributes) use ($constructionCategories) {
            $name = $this->faker->randomElement($constructionCategories);
            return [
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $this->faker->paragraph(1) . ' Especializado en servicios de construcción.',
                'icon' => 'fas fa-hammer',
            ];
        });
    }

    /**
     * Create technology-related categories.
     */
    public function technology(): static
    {
        $techCategories = [
            'Desarrollo Web',
            'Diseño Gráfico',
            'Soporte Técnico',
            'Reparación de Computadoras',
            'Marketing Digital',
            'Consultoría IT',
            'Desarrollo de Apps',
            'Seguridad Informática'
        ];

        return $this->state(function (array $attributes) use ($techCategories) {
            $name = $this->faker->randomElement($techCategories);
            return [
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $this->faker->paragraph(1) . ' Servicios tecnológicos especializados.',
                'icon' => 'fas fa-laptop-code',
            ];
        });
    }

    /**
     * Create service-related categories.
     */
    public function services(): static
    {
        $serviceCategories = [
            'Limpieza del Hogar',
            'Jardinería',
            'Cuidado de Mascotas',
            'Cuidado de Niños',
            'Cuidado de Adultos Mayores',
            'Servicios de Delivery',
            'Mudanzas',
            'Mantenimiento'
        ];

        return $this->state(function (array $attributes) use ($serviceCategories) {
            $name = $this->faker->randomElement($serviceCategories);
            return [
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $this->faker->paragraph(1) . ' Servicios especializados para el hogar.',
                'icon' => 'fas fa-home',
            ];
        });
    }

    /**
     * Create a category with a specific name.
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