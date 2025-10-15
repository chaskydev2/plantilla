<?php

namespace Database\Seeders;

use App\Models\Profession;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProfessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professions = [
            // Construcción e Ingeniería
            [
                'name' => 'Ingeniero Civil',
                'description' => 'Profesional especializado en el diseño, construcción y mantenimiento de infraestructuras como carreteras, puentes, edificios y sistemas de agua.'
            ],
            [
                'name' => 'Arquitecto',
                'description' => 'Profesional que diseña y planifica espacios habitables, combinando funcionalidad, estética y sostenibilidad en proyectos arquitectónicos.'
            ],
            [
                'name' => 'Ingeniero Eléctrico',
                'description' => 'Especialista en sistemas eléctricos, diseño de instalaciones eléctricas, automatización y sistemas de potencia.'
            ],
            [
                'name' => 'Ingeniero Mecánico',
                'description' => 'Profesional que diseña, desarrolla y mantiene sistemas mecánicos, maquinaria y equipos industriales.'
            ],

            // Oficios de Construcción
            [
                'name' => 'Albañil',
                'description' => 'Especialista en construcción de muros, cimientos, y estructuras utilizando materiales como ladrillo, cemento y piedra.'
            ],
            [
                'name' => 'Carpintero',
                'description' => 'Artesano especializado en trabajar la madera para crear muebles, estructuras y elementos decorativos.'
            ],
            [
                'name' => 'Electricista',
                'description' => 'Técnico especializado en instalaciones eléctricas residenciales, comerciales e industriales.'
            ],
            [
                'name' => 'Plomero',
                'description' => 'Técnico especializado en instalación y reparación de sistemas de fontanería, tuberías y sistemas sanitarios.'
            ],
            [
                'name' => 'Pintor',
                'description' => 'Profesional especializado en acabados de pintura para interiores y exteriores, incluyendo técnicas decorativas.'
            ],
            [
                'name' => 'Soldador',
                'description' => 'Técnico especializado en unión de metales mediante soldadura para estructuras, tuberías y maquinaria.'
            ],

            // Servicios Técnicos
            [
                'name' => 'Técnico en Refrigeración',
                'description' => 'Especialista en instalación, mantenimiento y reparación de sistemas de refrigeración y aire acondicionado.'
            ],
            [
                'name' => 'Técnico en Sistemas',
                'description' => 'Profesional especializado en mantenimiento, configuración y soporte de sistemas informáticos y redes.'
            ],
            [
                'name' => 'Mecánico Automotriz',
                'description' => 'Técnico especializado en diagnóstico, reparación y mantenimiento de vehículos automotores.'
            ],
            [
                'name' => 'Técnico en Electrónica',
                'description' => 'Especialista en reparación y mantenimiento de equipos electrónicos, circuitos y componentes.'
            ],

            // Tecnología e Informática
            [
                'name' => 'Desarrollador Web',
                'description' => 'Programador especializado en creación de sitios web, aplicaciones web y sistemas online.'
            ],
            [
                'name' => 'Diseñador Gráfico',
                'description' => 'Profesional creativo especializado en comunicación visual, branding y diseño digital.'
            ],
            [
                'name' => 'Especialista en Marketing Digital',
                'description' => 'Profesional especializado en estrategias de marketing online, redes sociales y publicidad digital.'
            ],
            [
                'name' => 'Analista de Datos',
                'description' => 'Especialista en análisis e interpretación de datos para la toma de decisiones empresariales.'
            ],

            // Salud y Bienestar
            [
                'name' => 'Médico General',
                'description' => 'Profesional de la salud especializado en diagnóstico, tratamiento y prevención de enfermedades.'
            ],
            [
                'name' => 'Enfermero',
                'description' => 'Profesional de la salud especializado en cuidado y atención directa de pacientes.'
            ],
            [
                'name' => 'Fisioterapeuta',
                'description' => 'Especialista en rehabilitación física y tratamiento de lesiones mediante terapia física.'
            ],
            [
                'name' => 'Psicólogo',
                'description' => 'Profesional especializado en salud mental, terapia psicológica y comportamiento humano.'
            ],
            [
                'name' => 'Nutricionista',
                'description' => 'Especialista en alimentación y nutrición para promover la salud y tratar enfermedades.'
            ],
            [
                'name' => 'Personal Trainer',
                'description' => 'Profesional especializado en entrenamiento físico personalizado y acondicionamiento deportivo.'
            ],

            // Servicios Profesionales
            [
                'name' => 'Contador',
                'description' => 'Profesional especializado en contabilidad, finanzas y asesoría tributaria para empresas y particulares.'
            ],
            [
                'name' => 'Abogado',
                'description' => 'Profesional del derecho especializado en asesoría legal, representación judicial y consultoría jurídica.'
            ],
            [
                'name' => 'Consultor Empresarial',
                'description' => 'Especialista en asesoría estratégica, mejora de procesos y desarrollo organizacional.'
            ],
            [
                'name' => 'Traductor',
                'description' => 'Profesional especializado en traducción e interpretación de idiomas para documentos y comunicaciones.'
            ],

            // Servicios del Hogar
            [
                'name' => 'Jardinero',
                'description' => 'Especialista en diseño, mantenimiento y cuidado de jardines, áreas verdes y paisajismo.'
            ],
            [
                'name' => 'Personal de Limpieza',
                'description' => 'Profesional especializado en servicios de limpieza residencial y comercial.'
            ],
            [
                'name' => 'Chef',
                'description' => 'Profesional culinario especializado en preparación de alimentos, gastronomía y servicios de catering.'
            ],
            [
                'name' => 'Niñera',
                'description' => 'Profesional especializada en cuidado infantil, educación inicial y atención de menores.'
            ],

            // Arte y Creatividad
            [
                'name' => 'Fotógrafo',
                'description' => 'Artista visual especializado en captura de imágenes para eventos, retratos y proyectos comerciales.'
            ],
            [
                'name' => 'Diseñador de Interiores',
                'description' => 'Profesional especializado en diseño y decoración de espacios interiores funcionales y estéticos.'
            ],
            [
                'name' => 'Músico',
                'description' => 'Artista especializado en interpretación musical, composición y entretenimiento para eventos.'
            ],

            // Educación
            [
                'name' => 'Profesor Particular',
                'description' => 'Educador especializado en enseñanza personalizada y apoyo académico en diversas materias.'
            ],
            [
                'name' => 'Instructor de Idiomas',
                'description' => 'Profesional especializado en enseñanza de idiomas extranjeros y comunicación intercultural.'
            ],

            // Otros Servicios
            [
                'name' => 'Veterinario',
                'description' => 'Profesional especializado en salud animal, diagnóstico y tratamiento de mascotas y animales.'
            ],
            [
                'name' => 'Peluquero',
                'description' => 'Profesional especializado en corte, peinado y tratamientos capilares para cuidado personal.'
            ],
            [
                'name' => 'Conductor',
                'description' => 'Profesional especializado en transporte de personas o mercancías, servicios de delivery y logística.'
            ],
        ];

        foreach ($professions as $professionData) {
            Profession::firstOrCreate(
                ['slug' => Str::slug($professionData['name'])],
                [
                    'name' => $professionData['name'],
                    'slug' => Str::slug($professionData['name']),
                    'description' => $professionData['description']
                ]
            );
        }

        // Create additional random professions for testing
        Profession::factory()
            ->count(10)
            ->create();

        $this->command->info('Professions seeded successfully!');
    }
}