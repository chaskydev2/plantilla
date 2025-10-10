<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

class AssignRolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roleAdmin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'api'
        ]);

        // Crear roles adicionales
        $roleManager = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'api'
        ]);

        $roleEditor = Role::firstOrCreate([
            'name' => 'editor',
            'guard_name' => 'api'
        ]);

        $roleAdmin->syncPermissions(Permission::where('guard_name', 'api')->get());

        $user = User::firstOrCreate(
            ['email' => 'admin@ctb.com.bo'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        
        // Asignar múltiples roles usando array de nombres
        $user->syncRoles(['admin', 'manager', 'editor']);
        
        // O usando array de objetos Role
        // $user->syncRoles([$roleAdmin, $roleManager, $roleEditor]);

        $this->command->info('Admin role and permissions assigned successfully!');
    }
}
