<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\Contractor;
use App\Models\HomeownerProfile;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ejemplo de cómo crear reviews de prueba
        
        // Obtener algunos contractors y homeowners
        $contractors = Contractor::limit(5)->get();
        $homeowners = HomeownerProfile::limit(3)->get();

        if ($contractors->isEmpty() || $homeowners->isEmpty()) {
            $this->command->info('No hay contractors o homeowners para crear reviews');
            return;
        }

        $comments = [
            'Excelente trabajo, muy profesional y puntual',
            'Muy buen servicio, lo recomiendo ampliamente',
            'Trabajo bien hecho, pero un poco caro',
            'Satisfecho con el resultado, aunque tardó un poco',
            'No cumplió con las expectativas',
            'Servicio excepcional, superó mis expectativas',
            'Trabajo decente, nada especial',
            'Muy profesional y detallista',
            'No volvería a contratarlo',
            'Perfecto, exactamente lo que necesitaba',
        ];

        foreach ($homeowners as $homeowner) {
            foreach ($contractors->random(rand(1, 3)) as $contractor) {
                Review::create([
                    'homeowner_profile_id' => $homeowner->user_id,
                    'contractor_id' => $contractor->user_id,
                    'rating' => rand(1, 5),
                    'comment' => $comments[array_rand($comments)],
                ]);
            }
        }

        // Actualizar promedios de todos los contractors
        foreach ($contractors as $contractor) {
            $contractor->updateAverageRating();
        }

        $this->command->info('Reviews creadas exitosamente');
    }
}
