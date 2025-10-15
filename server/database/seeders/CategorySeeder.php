<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Construcción e Ingeniería
            [
                'name' => 'Construcción',
                'description' => 'Servicios de construcción, remodelación y obras civiles',
                'icon' => 'fas fa-hammer',
                'children' => [
                    [
                        'name' => 'Construcción Residencial',
                        'description' => 'Construcción de casas, departamentos y viviendas',
                        'icon' => 'fas fa-home'
                    ],
                    [
                        'name' => 'Construcción Comercial',
                        'description' => 'Construcción de oficinas, locales comerciales y edificios',
                        'icon' => 'fas fa-building'
                    ],
                    [
                        'name' => 'Renovaciones',
                        'description' => 'Remodelación y renovación de espacios existentes',
                        'icon' => 'fas fa-tools'
                    ],
                    [
                        'name' => 'Albañilería',
                        'description' => 'Trabajos de mampostería, muros y estructuras',
                        'icon' => 'fas fa-city'
                    ]
                ]
            ],

            // Servicios Técnicos
            [
                'name' => 'Servicios Técnicos',
                'description' => 'Servicios especializados y técnicos para el hogar y empresa',
                'icon' => 'fas fa-wrench',
                'children' => [
                    [
                        'name' => 'Electricidad',
                        'description' => 'Instalaciones eléctricas, reparaciones y mantenimiento',
                        'icon' => 'fas fa-bolt'
                    ],
                    [
                        'name' => 'Plomería',
                        'description' => 'Instalación y reparación de sistemas de agua y desagüe',
                        'icon' => 'fas fa-faucet'
                    ],
                    [
                        'name' => 'Carpintería',
                        'description' => 'Trabajos en madera, muebles y estructuras',
                        'icon' => 'fas fa-saw'
                    ],
                    [
                        'name' => 'Soldadura',
                        'description' => 'Trabajos de soldadura y estructuras metálicas',
                        'icon' => 'fas fa-fire'
                    ]
                ]
            ],

            // Tecnología
            [
                'name' => 'Tecnología',
                'description' => 'Servicios informáticos y tecnológicos',
                'icon' => 'fas fa-laptop-code',
                'children' => [
                    [
                        'name' => 'Desarrollo Web',
                        'description' => 'Creación de sitios web y aplicaciones online',
                        'icon' => 'fas fa-globe'
                    ],
                    [
                        'name' => 'Diseño Gráfico',
                        'description' => 'Diseño visual, logos y material publicitario',
                        'icon' => 'fas fa-paint-brush'
                    ],
                    [
                        'name' => 'Soporte Técnico',
                        'description' => 'Mantenimiento y reparación de equipos informáticos',
                        'icon' => 'fas fa-desktop'
                    ],
                    [
                        'name' => 'Marketing Digital',
                        'description' => 'Publicidad online, redes sociales y SEO',
                        'icon' => 'fas fa-chart-line'
                    ]
                ]
            ],

            // Salud y Bienestar
            [
                'name' => 'Salud y Bienestar',
                'description' => 'Servicios relacionados con la salud y el bienestar',
                'icon' => 'fas fa-heartbeat',
                'children' => [
                    [
                        'name' => 'Medicina General',
                        'description' => 'Consultas médicas generales y diagnósticos',
                        'icon' => 'fas fa-stethoscope'
                    ],
                    [
                        'name' => 'Fisioterapia',
                        'description' => 'Rehabilitación física y terapias especializadas',
                        'icon' => 'fas fa-running'
                    ],
                    [
                        'name' => 'Psicología',
                        'description' => 'Terapia psicológica y apoyo emocional',
                        'icon' => 'fas fa-brain'
                    ],
                    [
                        'name' => 'Nutrición',
                        'description' => 'Asesoría nutricional y planes alimentarios',
                        'icon' => 'fas fa-apple-alt'
                    ]
                ]
            ],

            // Servicios del Hogar
            [
                'name' => 'Servicios del Hogar',
                'description' => 'Servicios domésticos y cuidado del hogar',
                'icon' => 'fas fa-home',
                'children' => [
                    [
                        'name' => 'Limpieza',
                        'description' => 'Servicios de limpieza residencial y comercial',
                        'icon' => 'fas fa-broom'
                    ],
                    [
                        'name' => 'Jardinería',
                        'description' => 'Mantenimiento de jardines y áreas verdes',
                        'icon' => 'fas fa-seedling'
                    ],
                    [
                        'name' => 'Cuidado de Niños',
                        'description' => 'Servicios de niñera y cuidado infantil',
                        'icon' => 'fas fa-baby'
                    ],
                    [
                        'name' => 'Cuidado de Mascotas',
                        'description' => 'Paseo, cuidado y atención de mascotas',
                        'icon' => 'fas fa-paw'
                    ]
                ]
            ],

            // Educación
            [
                'name' => 'Educación',
                'description' => 'Servicios educativos y de enseñanza',
                'icon' => 'fas fa-graduation-cap',
                'children' => [
                    [
                        'name' => 'Clases Particulares',
                        'description' => 'Tutorías y apoyo académico personalizado',
                        'icon' => 'fas fa-chalkboard-teacher'
                    ],
                    [
                        'name' => 'Idiomas',
                        'description' => 'Enseñanza de idiomas extranjeros',
                        'icon' => 'fas fa-language'
                    ],
                    [
                        'name' => 'Música',
                        'description' => 'Clases de instrumentos musicales y canto',
                        'icon' => 'fas fa-music'
                    ],
                    [
                        'name' => 'Arte',
                        'description' => 'Clases de pintura, dibujo y artes plásticas',
                        'icon' => 'fas fa-palette'
                    ]
                ]
            ],

            // Transporte
            [
                'name' => 'Transporte',
                'description' => 'Servicios de transporte y logística',
                'icon' => 'fas fa-truck',
                'children' => [
                    [
                        'name' => 'Taxi y Uber',
                        'description' => 'Servicios de transporte de personas',
                        'icon' => 'fas fa-taxi'
                    ],
                    [
                        'name' => 'Delivery',
                        'description' => 'Servicios de entrega y mensajería',
                        'icon' => 'fas fa-motorcycle'
                    ],
                    [
                        'name' => 'Mudanzas',
                        'description' => 'Servicios de mudanza y traslado de bienes',
                        'icon' => 'fas fa-dolly'
                    ],
                    [
                        'name' => 'Carga Pesada',
                        'description' => 'Transporte de carga y materiales',
                        'icon' => 'fas fa-truck-loading'
                    ]
                ]
            ],

            // Belleza y Estética
            [
                'name' => 'Belleza y Estética',
                'description' => 'Servicios de belleza y cuidado personal',
                'icon' => 'fas fa-cut',
                'children' => [
                    [
                        'name' => 'Peluquería',
                        'description' => 'Corte, peinado y tratamientos capilares',
                        'icon' => 'fas fa-scissors'
                    ],
                    [
                        'name' => 'Estética',
                        'description' => 'Tratamientos faciales y corporales',
                        'icon' => 'fas fa-spa'
                    ],
                    [
                        'name' => 'Manicure y Pedicure',
                        'description' => 'Cuidado de uñas de manos y pies',
                        'icon' => 'fas fa-hand-sparkles'
                    ],
                    [
                        'name' => 'Maquillaje',
                        'description' => 'Servicios de maquillaje para eventos',
                        'icon' => 'fas fa-eye'
                    ]
                ]
            ],

            // Eventos
            [
                'name' => 'Eventos',
                'description' => 'Organización y servicios para eventos',
                'icon' => 'fas fa-calendar-alt',
                'children' => [
                    [
                        'name' => 'Fotografía',
                        'description' => 'Servicios fotográficos para eventos y retratos',
                        'icon' => 'fas fa-camera'
                    ],
                    [
                        'name' => 'Catering',
                        'description' => 'Servicios de comida para eventos',
                        'icon' => 'fas fa-utensils'
                    ],
                    [
                        'name' => 'Decoración',
                        'description' => 'Decoración y ambientación de eventos',
                        'icon' => 'fas fa-gifts'
                    ],
                    [
                        'name' => 'DJ y Música',
                        'description' => 'Servicios musicales para fiestas y eventos',
                        'icon' => 'fas fa-music'
                    ]
                ]
            ],

            // Servicios Profesionales
            [
                'name' => 'Servicios Profesionales',
                'description' => 'Servicios profesionales y de consultoría',
                'icon' => 'fas fa-briefcase',
                'children' => [
                    [
                        'name' => 'Legal',
                        'description' => 'Servicios legales y asesoría jurídica',
                        'icon' => 'fas fa-balance-scale'
                    ],
                    [
                        'name' => 'Contabilidad',
                        'description' => 'Servicios contables y tributarios',
                        'icon' => 'fas fa-calculator'
                    ],
                    [
                        'name' => 'Consultoría',
                        'description' => 'Consultoría empresarial y estratégica',
                        'icon' => 'fas fa-handshake'
                    ],
                    [
                        'name' => 'Traducción',
                        'description' => 'Servicios de traducción e interpretación',
                        'icon' => 'fas fa-language'
                    ]
                ]
            ]
        ];

        foreach ($categories as $parentData) {
            $parent = Category::create([
                'name' => $parentData['name'],
                'slug' => Str::slug($parentData['name']),
                'description' => $parentData['description'],
                'icon' => $parentData['icon'],
                'parent_id' => null
            ]);

            if (isset($parentData['children'])) {
                foreach ($parentData['children'] as $childData) {
                    Category::create([
                        'name' => $childData['name'],
                        'slug' => Str::slug($childData['name']),
                        'description' => $childData['description'],
                        'icon' => $childData['icon'],
                        'parent_id' => $parent->id
                    ]);
                }
            }
        }

        $this->command->info('Categories seeded successfully!');
    }
}