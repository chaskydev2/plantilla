<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'Laravel'],
            ['name' => 'PHP'],
            ['name' => 'JavaScript'],
            ['name' => 'TypeScript'],
            ['name' => 'React'],
            ['name' => 'Vue.js'],
            ['name' => 'Angular'],
            ['name' => 'Node.js'],
            ['name' => 'MySQL'],
            ['name' => 'PostgreSQL'],
            ['name' => 'MongoDB'],
            ['name' => 'Redis'],
            ['name' => 'Docker'],
            ['name' => 'Kubernetes'],
            ['name' => 'AWS'],
            ['name' => 'Azure'],
            ['name' => 'Git'],
            ['name' => 'CI/CD'],
            ['name' => 'API REST'],
            ['name' => 'GraphQL'],
            ['name' => 'Microservicios'],
            ['name' => 'TDD'],
            ['name' => 'Clean Code'],
            ['name' => 'SOLID'],
            ['name' => 'Design Patterns'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
