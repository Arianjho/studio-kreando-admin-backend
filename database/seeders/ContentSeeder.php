<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use App\Models\Category;
use App\Models\ContactContent;
use App\Models\HomeContent;
use App\Models\Media;
use App\Models\Project;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Datos de ejemplo para el estudio de arquitectura, portados del seed.ts
 * original de Payload. Solo project-1.jpg y detail-3.jpg existen como
 * assets reales en studio-kreando-website; se reciclan para el resto de
 * imagenes (el admin las reemplaza luego por las definitivas).
 */
class ContentSeeder extends Seeder
{
    protected string $assetsPath;

    public function run(): void
    {
        $this->assetsPath = base_path('../studio-kreando-website/src/assets');

        $categories = $this->seedCategories();
        $this->seedProjects($categories);
        $this->seedHome();
        $this->seedAbout();
        $this->seedContact();
        $this->seedSiteSettings();
    }

    protected function uploadMedia(string $sourceFilename, string $alt): Media
    {
        $sourcePaths = [
            $this->assetsPath.'/'.$sourceFilename,
            $this->assetsPath.'/project-1.jpg',
            $this->assetsPath.'/detail-3.jpg',
        ];

        $sourcePath = collect($sourcePaths)->first(fn ($path) => is_file($path));

        $extension = $sourcePath ? pathinfo($sourcePath, PATHINFO_EXTENSION) : 'jpg';
        $storedPath = 'media/'.Str::uuid().'.'.$extension;

        $dimensions = $sourcePath ? @getimagesize($sourcePath) : false;

        if ($sourcePath) {
            Storage::disk('public')->put($storedPath, file_get_contents($sourcePath));
        }

        return Media::create([
            'disk' => 'public',
            'path' => $storedPath,
            'alt' => $alt,
            'mime_type' => 'image/jpeg',
            'size' => $sourcePath ? filesize($sourcePath) : 0,
            'width' => $dimensions[0] ?? null,
            'height' => $dimensions[1] ?? null,
        ]);
    }

    protected function richText(array $paragraphs): string
    {
        return implode("\n\n", $paragraphs);
    }

    /** @return array<string, Category> */
    protected function seedCategories(): array
    {
        $names = ['Residencial', 'Comercial', 'Interiorismo', 'Urbano'];

        return collect($names)
            ->mapWithKeys(fn ($name) => [$name => Category::create(['name' => $name])])
            ->all();
    }

    protected function seedProjects(array $categories): void
    {
        $projects = [
            [
                'slug' => 'casa-adobe',
                'name' => 'Casa Adobe',
                'category' => 'Residencial',
                'year' => 2025,
                'location' => 'Cieneguilla, Lima',
                'area' => '410 m²',
                'program' => 'Vivienda unifamiliar',
                'team' => 'M. Ríos, A. Solano, C. Peña',
                'status' => 'Construido',
                'intro' => 'Una casa de hormigón visto que se abre al valle con un alero profundo.',
                'body' => $this->richText([
                    'El encargo pedía una vivienda que soportara el sol seco del valle sin recurrir a cerramientos opacos. La respuesta fue un volumen macizo perforado por un único gesto: un alero de nueve metros que sombrea toda la fachada norte y convierte la terraza en la habitación más usada de la casa.',
                    'Los materiales se reducen a tres: hormigón encofrado con tabla, carpintería de acero negro y piso continuo pulido. La vegetación nativa hace el resto del trabajo.',
                ]),
                'cover_file' => 'project-1.jpg',
                'cover_alt' => 'Fachada de hormigón de Casa Adobe al atardecer con alero profundo',
                'gallery' => [
                    ['file' => 'detail-1.jpg', 'alt' => 'Detalle de encuentro entre hormigón encofrado y roble'],
                    ['file' => 'detail-3.jpg', 'alt' => 'Galería interior con vanos rítmicos y luz rasante'],
                    ['file' => 'detail-2.jpg', 'alt' => 'Baño de travertino con lavabo monolítico'],
                ],
                'featured' => true,
                'order' => 0,
            ],
            [
                'slug' => 'patio-olivo',
                'name' => 'Patio Olivo',
                'category' => 'Residencial',
                'year' => 2024,
                'location' => 'Pachacámac, Lima',
                'area' => '285 m²',
                'program' => 'Vivienda con patio central',
                'team' => 'M. Ríos, L. Vergara',
                'status' => 'Construido',
                'intro' => 'Muros de cal encalada alrededor de un olivo centenario trasplantado.',
                'body' => $this->richText([
                    'Todo el proyecto gira alrededor de un árbol existente. Las habitaciones se ordenan en una U que abraza el patio, y cada una recibe luz por dos orientaciones distintas para cruzar ventilación durante el verano.',
                    'La albañilería de piedra recuperada del terreno aparece solo en el muro perimetral, marcando el límite entre lo construido y lo encontrado.',
                ]),
                'cover_file' => 'project-2.jpg',
                'cover_alt' => 'Patio interior encalado con olivo centenario y piso de piedra',
                'gallery' => [
                    ['file' => 'detail-2.jpg', 'alt' => 'Baño de travertino iluminado por una ventana ranura'],
                    ['file' => 'detail-1.jpg', 'alt' => 'Detalle de hormigón y madera bajo luz rasante'],
                ],
                'featured' => true,
                'order' => 1,
            ],
            [
                'slug' => 'casa-pinar',
                'name' => 'Casa Pinar',
                'category' => 'Residencial',
                'year' => 2024,
                'location' => 'Cañete, Lima',
                'area' => '320 m²',
                'program' => 'Casa de retiro',
                'team' => 'A. Solano, D. Quiroz',
                'status' => 'Construido',
                'intro' => 'Un pabellón acristalado que desaparece dentro del bosque de pinos.',
                'body' => $this->richText([
                    'La casa se plantea como un único plano horizontal sostenido por cuatro apoyos. El vidrio de piso a techo elimina la frontera entre sala y bosque: el paisaje entra completo y el mobiliario se mantiene bajo para no interrumpirlo.',
                    'El programa privado se hunde medio nivel en la pendiente, dejando la planta social como el único volumen visible desde el acceso.',
                ]),
                'cover_file' => 'project-3.jpg',
                'cover_alt' => 'Sala minimalista con ventanales al bosque de pinos',
                'gallery' => [
                    ['file' => 'detail-3.jpg', 'alt' => 'Corredor con luz proyectada sobre piso de hormigón'],
                    ['file' => 'detail-1.jpg', 'alt' => 'Detalle constructivo de hormigón y roble'],
                ],
                'featured' => true,
                'order' => 2,
            ],
            [
                'slug' => 'museo-costa',
                'name' => 'Museo de la Costa',
                'category' => 'Comercial',
                'year' => 2023,
                'location' => 'Barranco, Lima',
                'area' => '1 850 m²',
                'program' => 'Museo y archivo',
                'team' => 'M. Ríos, C. Peña, equipo completo',
                'status' => 'Construido',
                'intro' => 'Salas de hormigón donde la luz cenital ordena el recorrido.',
                'body' => $this->richText([
                    'El museo trabaja con una sola herramienta: la luz. Un lucernario recorre el eje longitudinal y va marcando los cambios de sala; los muros de hormigón encofrado quedan sin tratamiento para recibir esa luz como única textura.',
                    'La circulación es una espiral descendente que devuelve al visitante al vestíbulo sin repetir recorrido.',
                ]),
                'cover_file' => 'project-4.jpg',
                'cover_alt' => 'Escalera de hormigón iluminada por un lucernario en el museo',
                'gallery' => [
                    ['file' => 'detail-3.jpg', 'alt' => 'Corredor de exposición con vanos rítmicos'],
                    ['file' => 'detail-1.jpg', 'alt' => 'Detalle de hormigón encofrado con tabla'],
                ],
                'featured' => true,
                'order' => 3,
            ],
            [
                'slug' => 'bloque-terracota',
                'name' => 'Bloque Terracota',
                'category' => 'Comercial',
                'year' => 2025,
                'location' => 'San Isidro, Lima',
                'area' => '6 400 m²',
                'program' => 'Uso mixto: oficinas y comercio',
                'team' => 'A. Solano, L. Vergara, D. Quiroz',
                'status' => 'En obra',
                'intro' => 'Una celosía cerámica vertical que regula el sol de la avenida.',
                'body' => $this->richText([
                    'El edificio resuelve la orientación oeste con una celosía de piezas cerámicas extruidas que filtra la radiación directa sin cerrar las vistas. La cerámica se fabricó localmente en tres profundidades distintas según la altura.',
                    'La planta baja se retira para donar una vereda ancha y sombreada a la ciudad, con locales que abren en toda su longitud.',
                ]),
                'cover_file' => 'project-5.jpg',
                'cover_alt' => 'Fachada urbana con celosía vertical de terracota al atardecer',
                'gallery' => [
                    ['file' => 'detail-3.jpg', 'alt' => 'Corredor interior con luz controlada'],
                    ['file' => 'detail-1.jpg', 'alt' => 'Detalle de materiales cálidos y hormigón'],
                ],
                'featured' => true,
                'order' => 4,
            ],
            [
                'slug' => 'tienda-cal',
                'name' => 'Tienda Cal',
                'category' => 'Interiorismo',
                'year' => 2024,
                'location' => 'Miraflores, Lima',
                'area' => '140 m²',
                'program' => 'Retail de autor',
                'team' => 'C. Peña, L. Vergara',
                'status' => 'Construido',
                'intro' => 'Microcemento, curvas suaves y luz indirecta para una tienda de autor.',
                'body' => $this->richText([
                    'El local se resolvió con un único material continuo en muros y techos, de manera que la geometría curva se lea sin juntas. Todo el mobiliario expositivo es de acero inoxidable cepillado, deliberadamente frío frente al fondo cálido.',
                    'La iluminación es indirecta salvo dos puntos: la mesa central y el nicho de novedades.',
                ]),
                'cover_file' => 'project-6.jpg',
                'cover_alt' => 'Interior de tienda minimalista en microcemento con luz indirecta',
                'gallery' => [
                    ['file' => 'detail-2.jpg', 'alt' => 'Superficie monolítica de piedra en el probador'],
                    ['file' => 'detail-1.jpg', 'alt' => 'Detalle de textura de microcemento y madera'],
                ],
                'featured' => true,
                'order' => 5,
            ],
            [
                'slug' => 'plaza-abierta',
                'name' => 'Plaza Abierta',
                'category' => 'Urbano',
                'year' => 2023,
                'location' => 'Trujillo, La Libertad',
                'area' => '3 200 m²',
                'program' => 'Espacio público y pabellón',
                'team' => 'M. Ríos, D. Quiroz',
                'status' => 'Construido',
                'intro' => 'Un pórtico de acero y madera que da sombra a la vida de barrio.',
                'body' => $this->richText([
                    'La intervención sustituye un estacionamiento por una plaza continua de losas de concreto y arbolado nuevo. El único elemento construido es un pórtico ligero que produce sombra durante todo el día y aloja ferias, clases y mercados.',
                    'La estructura de acero se dejó vista, con cubierta de vigas de madera laminada a la vista para bajar la temperatura percibida.',
                ]),
                'cover_file' => 'project-7.jpg',
                'cover_alt' => 'Pabellón público con columnas de acero y techo de madera en la plaza',
                'gallery' => [
                    ['file' => 'detail-3.jpg', 'alt' => 'Recorrido cubierto con sombras alargadas'],
                    ['file' => 'detail-1.jpg', 'alt' => 'Detalle de madera y hormigón del pórtico'],
                ],
                'featured' => false,
                'order' => 6,
            ],
            [
                'slug' => 'casa-niebla',
                'name' => 'Casa Niebla',
                'category' => 'Residencial',
                'year' => 2026,
                'location' => 'Asia, Cañete',
                'area' => '265 m²',
                'program' => 'Casa de acantilado',
                'team' => 'A. Solano, C. Peña',
                'status' => 'En proyecto',
                'intro' => 'Un volumen oscuro en voladizo sobre un zócalo de piedra del lugar.',
                'body' => $this->richText([
                    'La casa se apoya en un zócalo de piedra extraída del propio corte del terreno y lanza el nivel social en voladizo sobre la pendiente, buscando el horizonte por encima de la neblina costera.',
                    'El revestimiento de madera quemada envejecerá igualando el tono de la roca, hasta que la casa se lea como parte del acantilado.',
                ]),
                'cover_file' => 'project-8.jpg',
                'cover_alt' => 'Casa de madera oscura en voladizo sobre acantilado con neblina',
                'gallery' => [
                    ['file' => 'detail-2.jpg', 'alt' => 'Interior de piedra con luz filtrada'],
                    ['file' => 'detail-3.jpg', 'alt' => 'Pasillo con secuencia de vanos hacia el mar'],
                ],
                'featured' => false,
                'order' => 7,
            ],
        ];

        foreach ($projects as $data) {
            $cover = $this->uploadMedia($data['cover_file'], $data['cover_alt']);

            $gallery = collect($data['gallery'])->map(function ($item) {
                $media = $this->uploadMedia($item['file'], $item['alt']);

                return ['media_id' => $media->id, 'url' => $media->url, 'alt' => $item['alt']];
            })->all();

            Project::create([
                'slug' => $data['slug'],
                'name' => $data['name'],
                'category_id' => $categories[$data['category']]->id,
                'year' => $data['year'],
                'location' => $data['location'],
                'area' => $data['area'],
                'program' => $data['program'],
                'team' => $data['team'],
                'status' => $data['status'],
                'intro' => $data['intro'],
                'body' => $data['body'],
                'cover_id' => $cover->id,
                'cover_alt' => $data['cover_alt'],
                'gallery' => $gallery,
                'featured' => $data['featured'],
                'order' => $data['order'],
            ]);
        }
    }

    protected function seedHome(): void
    {
        $heroImage = $this->uploadMedia('project-1.jpg', 'Casa Adobe: fachada de hormigón visto al atardecer entre vegetación');
        $serviceA = $this->uploadMedia('project-3.jpg', 'Diseño arquitectónico');
        $serviceB = $this->uploadMedia('detail-2.jpg', 'Interiorismo');
        $serviceC = $this->uploadMedia('project-7.jpg', 'Espacio público');
        $serviceD = $this->uploadMedia('studio-team.jpg', 'Dirección de obra');

        HomeContent::create([
            'hero_headline' => 'Diseñamos espacios que inspiran y perduran',
            'hero_subtext' => 'Convertimos visiones en arquitectura atemporal, uniendo diseño sensible con una ejecución impecable en obra.',
            'hero_image_id' => $heroImage->id,
            'hero_cta_primary_label' => 'Agendar una consulta gratuita',
            'hero_cta_secondary_label' => 'Ver portafolio',
            'about_heading' => 'Sobre el estudio',
            'about_text' => 'En KreanDDo Arquitectos creemos que la arquitectura es más que construir: se trata de crear entornos que mejoran la manera en que vivimos. Trabajamos pocos encargos al año para estar en obra cada semana.',
            'about_cta_label' => 'Conocer el estudio',
            'stats' => [
                ['value' => '15+', 'label' => 'Años de excelencia en arquitectura y diseño'],
                ['value' => '38', 'label' => 'Proyectos construidos y entregados'],
                ['value' => '96%', 'label' => 'De clientes que vuelven con un segundo encargo'],
                ['value' => '5', 'label' => 'Regiones del país con obra nuestra'],
            ],
            'services' => [
                ['number' => '01', 'title' => 'Diseño arquitectónico', 'description' => 'Desde el análisis de sitio hasta el proyecto definitivo.', 'media_id' => $serviceA->id, 'url' => $serviceA->url],
                ['number' => '02', 'title' => 'Interiorismo', 'description' => 'Espacios interiores coherentes, con mobiliario a medida.', 'media_id' => $serviceB->id, 'url' => $serviceB->url],
                ['number' => '03', 'title' => 'Espacio público', 'description' => 'Diseñamos lo que ocurre entre los edificios y el paisaje.', 'media_id' => $serviceC->id, 'url' => $serviceC->url],
                ['number' => '04', 'title' => 'Dirección de obra', 'description' => 'Supervisión semanal, control de acabados y cierre técnico.', 'media_id' => $serviceD->id, 'url' => $serviceD->url],
            ],
            'credits' => [
                ['name' => 'Bienal Peruana'], ['name' => 'Arquine'], ['name' => 'Casacor'], ['name' => 'ArchDaily'],
            ],
            'portfolio_heading' => 'Nuestro portafolio de diseño',
            'portfolio_text' => 'Una selección de obra que muestra nuestro compromiso con la excelencia del detalle y la satisfacción de cada cliente.',
            'cta_heading' => '¿Tienes un terreno, una idea o un espacio por transformar?',
            'cta_text' => 'Escríbenos y agendamos una primera conversación sin costo.',
            'cta_button_label' => 'Hablemos de tu proyecto',
        ]);
    }

    protected function seedAbout(): void
    {
        $heroImage = $this->uploadMedia('studio-team.jpg', 'Equipo del estudio trabajando con maquetas y planos sobre una mesa larga');
        $detailImage = $this->uploadMedia('detail-1.jpg', 'Detalle de hormigón encofrado en contacto con paneles de roble');

        AboutContent::create([
            'hero_image_id' => $heroImage->id,
            'hero_headline' => 'Seis personas, un método y muchas horas en obra',
            'hero_subtext' => 'No perseguimos un estilo: perseguimos que una casa esté fresca en verano, que un muro envejezca bien y que la obra se parezca al plano.',
            'intro_paragraphs' => [
                ['text' => 'KreanDDo Arquitectos se fundó en Lima en 2011. Somos seis personas y trabajamos con un número deliberadamente bajo de encargos al año para poder estar en obra cada semana.'],
                ['text' => 'Nos interesan los proyectos donde el material está disponible cerca: piedra del corte, cerámica extruida en la región, maderas de la costa. Eso define más el resultado que cualquier referencia visual.'],
                ['text' => 'Trabajamos con especialistas estructurales, paisajistas y de iluminación desde la primera semana del proyecto, no al final.'],
            ],
            'services' => [
                ['number' => '01', 'title' => 'Anteproyecto y diseño', 'description' => 'Análisis de sitio, programa y volumetría hasta el proyecto definitivo.'],
                ['number' => '02', 'title' => 'Proyecto ejecutivo', 'description' => 'Planos, detalles constructivos, especificaciones y coordinación de especialidades.'],
                ['number' => '03', 'title' => 'Dirección de obra', 'description' => 'Supervisión semanal, control de acabados y cierre técnico.'],
                ['number' => '04', 'title' => 'Interiorismo y mobiliario', 'description' => 'Diseño a medida, materiales y desarrollo con carpinterías locales.'],
            ],
            'milestones' => [
                ['year' => '2011', 'text' => 'Fundación del estudio en Barranco'],
                ['year' => '2017', 'text' => 'Primer proyecto público construido'],
                ['year' => '2021', 'text' => 'Mención en la Bienal de Arquitectura Peruana'],
                ['year' => '2025', 'text' => '38 proyectos construidos en cinco regiones'],
            ],
            'detail_image_id' => $detailImage->id,
            'cta_label' => 'Conversemos un proyecto',
        ]);
    }

    protected function seedContact(): void
    {
        ContactContent::create([
            'address' => "Av. Pedro de Osma 214, piso 3\nBarranco, Lima, Perú",
            'email' => 'estudio@kreanddo.com',
            'phone' => '+51 1 234 567',
            'hours' => "Lunes a viernes\n9:00 — 18:00",
        ]);
    }

    protected function seedSiteSettings(): void
    {
        SiteSetting::create([
            'site_name' => 'KreanDDo Arquitectos',
            'site_url' => 'https://www.kreanddo.com',
            'default_seo_description' => 'Estudio de arquitectura en Lima: vivienda, comercio, interiorismo y espacio público.',
        ]);
    }
}
