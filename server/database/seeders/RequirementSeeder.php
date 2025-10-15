<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Requirement;

class RequirementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $requirements = [
            // Requisitos de Inscripción
            [
                'title' => 'Documento de Identidad',
                'description' => 'Presentar copia del documento de identidad vigente (cédula o pasaporte)',
                'type' => 'inscription',
                'order' => 1,
            ],
            [
                'title' => 'Certificado de Residencia',
                'description' => 'Certificado de residencia actualizado emitido por la autoridad competente',
                'type' => 'inscription',
                'order' => 2,
            ],
            [
                'title' => 'Formulario de Inscripción',
                'description' => 'Formulario de inscripción completado y firmado',
                'type' => 'inscription',
                'order' => 3,
            ],
            [
                'title' => 'Fotografía Reciente',
                'description' => 'Dos fotografías tamaño carnet recientes (fondo blanco)',
                'type' => 'inscription',
                'order' => 4,
            ],
            [
                'title' => 'Comprobante de Domicilio',
                'description' => 'Factura de servicio público (agua, luz o teléfono) no mayor a 3 meses',
                'type' => 'inscription',
                'order' => 5,
            ],

            // Requisitos de Renovación
            [
                'title' => 'Pago de Cuota Anual',
                'description' => 'Comprobante de pago de la cuota anual de membresía',
                'type' => 'renovation',
                'order' => 1,
            ],
            [
                'title' => 'Formulario de Renovación',
                'description' => 'Formulario de renovación completado y firmado',
                'type' => 'renovation',
                'order' => 2,
            ],
            [
                'title' => 'Certificado de Solvencia',
                'description' => 'Certificado de que no tiene deudas pendientes con la organización',
                'type' => 'renovation',
                'order' => 3,
            ],
            [
                'title' => 'Documento de Identidad Actualizado',
                'description' => 'Copia del documento de identidad vigente',
                'type' => 'renovation',
                'order' => 4,
            ],

            // Requisitos de Actualización de Información
            [
                'title' => 'Formulario de Actualización',
                'description' => 'Formulario de actualización de datos personales',
                'type' => 'updateinfo',
                'order' => 1,
            ],
            [
                'title' => 'Documentos Soporte',
                'description' => 'Documentos que respalden los cambios de información (certificados, facturas, etc.)',
                'type' => 'updateinfo',
                'order' => 2,
            ],
            [
                'title' => 'Declaración Jurada',
                'description' => 'Declaración jurada de veracidad de la información proporcionada',
                'type' => 'updateinfo',
                'order' => 3,
            ],
        ];

        foreach ($requirements as $requirement) {
            Requirement::create($requirement);
        }
    }
}
