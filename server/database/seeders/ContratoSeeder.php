<?php

namespace Database\Seeders;

use App\Models\Contrato;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContratoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear algunos usuarios específicos para contratos si no existen
        $users = User::whereDoesntHave('contrato')->limit(50)->get();
        
        if ($users->count() < 10) {
            // Crear usuarios adicionales si no hay suficientes
            User::factory(20)->create();
            $users = User::whereDoesntHave('contrato')->limit(50)->get();
        }

        foreach ($users as $user) {
            Contrato::factory()
                ->for($user, 'user')
                ->create();
        }

        // Crear algunos contratos específicos con estados diferentes
        if ($users->count() >= 20) {
            // Contratos aprobados con alta calificación
            Contrato::factory(5)
                ->approved()
                ->highRating()
                ->insured()
                ->withDrivingLicense()
                ->create();

            // Contratos pendientes
            Contrato::factory(3)
                ->pending()
                ->create();

            // Contratos rechazados
            Contrato::factory(2)
                ->rejected()
                ->create();

            // Contratos suspendidos
            Contrato::factory(1)
                ->suspended()
                ->create();

            // Contratos por área de servicio específica
            Contrato::factory(3)
                ->approved()
                ->serviceArea('Plomería')
                ->inCity('La Paz')
                ->create();

            Contrato::factory(3)
                ->approved()
                ->serviceArea('Electricidad')
                ->inCity('Santa Cruz')
                ->create();

            Contrato::factory(2)
                ->approved()
                ->serviceArea('Carpintería')
                ->inCity('Cochabamba')
                ->create();
        }

        $this->command->info('Contratos creados exitosamente.');
    }
}