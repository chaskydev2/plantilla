<?php

namespace Database\Seeders;

use App\Models\AttributeModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            // Atributos para Contratistas
            [
                'name' => 'Años de Experiencia',
                'description' => 'Número de años de experiencia profesional en el área',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Certificaciones Profesionales',
                'description' => 'Certificaciones y títulos profesionales obtenidos',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Licencias y Permisos',
                'description' => 'Licencias profesionales y permisos legales para ejercer',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Seguros de Responsabilidad',
                'description' => 'Seguros de responsabilidad civil y laboral',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Herramientas y Equipos',
                'description' => 'Herramientas y equipos profesionales disponibles',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Especialidades',
                'description' => 'Áreas de especialización dentro de la profesión',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Referencias Laborales',
                'description' => 'Referencias de trabajos anteriores y clientes',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Portafolio de Trabajos',
                'description' => 'Muestra de trabajos realizados y proyectos completados',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Área de Cobertura',
                'description' => 'Zona geográfica donde ofrece sus servicios',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Horarios de Disponibilidad',
                'description' => 'Horarios y días disponibles para trabajar',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Tarifa por Hora',
                'description' => 'Costo por hora de trabajo o servicio',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],
            [
                'name' => 'Tiempo de Respuesta',
                'description' => 'Tiempo promedio de respuesta a solicitudes',
                'required_for' => AttributeModel::REQUIRED_FOR_CONTRACTOR
            ],

            // Atributos para Propietarios
            [
                'name' => 'Tipo de Propiedad',
                'description' => 'Casa, departamento, oficina, local comercial, etc.',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],
            [
                'name' => 'Metros Cuadrados',
                'description' => 'Tamaño de la propiedad en metros cuadrados',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],
            [
                'name' => 'Número de Habitaciones',
                'description' => 'Cantidad de habitaciones en la propiedad',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],
            [
                'name' => 'Año de Construcción',
                'description' => 'Año en que fue construida la propiedad',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],
            [
                'name' => 'Estado de la Propiedad',
                'description' => 'Condición actual: nueva, usada, para remodelar, etc.',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],
            [
                'name' => 'Presupuesto Disponible',
                'description' => 'Rango de presupuesto para proyectos o servicios',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],
            [
                'name' => 'Urgencia del Proyecto',
                'description' => 'Nivel de urgencia: inmediato, en una semana, en un mes, etc.',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],
            [
                'name' => 'Preferencias de Horario',
                'description' => 'Horarios preferidos para recibir servicios',
                'required_for' => AttributeModel::REQUIRED_FOR_HOMEOWNER
            ],

            // Atributos para Ambos
            [
                'name' => 'Idiomas',
                'description' => 'Idiomas que habla o prefiere para comunicación',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Ubicación',
                'description' => 'Ubicación geográfica (ciudad, barrio, zona)',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Método de Contacto Preferido',
                'description' => 'WhatsApp, llamada, email, etc.',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Disponibilidad de Fin de Semana',
                'description' => 'Disponibilidad para trabajar o recibir servicios en fines de semana',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Calificación Promedio',
                'description' => 'Calificación promedio basada en reviews y evaluaciones',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Número de Proyectos Completados',
                'description' => 'Cantidad total de proyectos o servicios completados',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Verificación de Identidad',
                'description' => 'Estado de verificación de identidad y documentos',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Miembro Desde',
                'description' => 'Fecha de registro en la plataforma',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Última Actividad',
                'description' => 'Fecha de la última actividad en la plataforma',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Método de Pago Preferido',
                'description' => 'Efectivo, transferencia, tarjeta, etc.',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Política de Cancelación',
                'description' => 'Términos y condiciones para cancelaciones',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ],
            [
                'name' => 'Garantía Ofrecida',
                'description' => 'Tipo de garantía ofrecida en trabajos o servicios',
                'required_for' => AttributeModel::REQUIRED_FOR_BOTH
            ]
        ];

        foreach ($attributes as $attributeData) {
            AttributeModel::firstOrCreate(
                ['slug' => Str::slug($attributeData['name'])],
                [
                    'name' => $attributeData['name'],
                    'slug' => Str::slug($attributeData['name']),
                    'description' => $attributeData['description'],
                    'required_for' => $attributeData['required_for']
                ]
            );
        }

        // Create additional random attributes for testing
        AttributeModel::factory()
            ->count(5)
            ->create();

        $this->command->info('Attributes seeded successfully!');
    }
}