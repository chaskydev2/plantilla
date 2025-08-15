<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $systemPermissions = [
            'usuario' => ['listar', 'ver', 'crear', 'editar', 'eliminar', 'restaurar'],
            'rol' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'permiso' => ['listar', 'ver'],
            'rol_permiso' => ['listar', 'editar'],
            'usuario_rol' => ['listar', 'editar'],
            'evento' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'curso' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'comunicado' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'tipo_evento' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'principio' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'contacto' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'historia' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'valor_moral' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'acuerdo' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'directiva' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'consulta' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'requisito' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'banner' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'pregunta_frecuente' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'red_social' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
            'payment' => ['listar', 'ver', 'crear', 'editar', 'eliminar'],
        ];

        foreach ($systemPermissions as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'name' => "{$module}_{$action}",
                    'guard_name' => 'api'
                ]);
            }
        }

        $this->command->info('Permissions seeded successfully!');
    }
}
