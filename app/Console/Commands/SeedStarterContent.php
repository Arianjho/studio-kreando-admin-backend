<?php

namespace App\Console\Commands;

use App\Models\AboutContent;
use App\Models\ContactContent;
use App\Models\HomeContent;
use App\Models\Media;
use App\Models\SiteSetting;
use Illuminate\Console\Command;

/**
 * Bootstrap de un solo uso para los 4 singletons de contenido (home/about/
 * contact/site-settings): sus páginas de edición en el admin hacen
 * firstOrFail(), así que no se puede crear la primera fila desde la UI.
 * Idempotente: si una tabla ya tiene una fila, la deja intacta.
 *
 * Requiere al menos 2 archivos ya subidos en Multimedia (admin/media) antes
 * de correrlo: usa los 2 primeros (por id) como hero/detail/servicios.
 */
class SeedStarterContent extends Command
{
    protected $signature = 'content:seed-starter';

    protected $description = 'Crea el contenido inicial de Inicio/Nosotros/Contacto/Ajustes si las tablas estan vacias';

    public function handle(): int
    {
        $media = Media::orderBy('id')->take(2)->get();

        if ($media->count() < 2) {
            $this->error('Se necesitan al menos 2 archivos en Multimedia (admin/media) antes de correr esto.');

            return self::FAILURE;
        }

        [$primary, $secondary] = [$media[0], $media[1]];

        if (HomeContent::query()->doesntExist()) {
            HomeContent::create([
                'hero_headline' => 'Diseñamos espacios que inspiran y perduran',
                'hero_subtext' => 'Convertimos visiones en arquitectura atemporal, uniendo diseño sensible con una ejecución impecable en obra.',
                'hero_image_id' => $primary->id,
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
                    ['number' => '01', 'title' => 'Diseño arquitectónico', 'description' => 'Desde el análisis de sitio hasta el proyecto definitivo.', 'media_id' => $primary->id, 'url' => $primary->url],
                    ['number' => '02', 'title' => 'Interiorismo', 'description' => 'Espacios interiores coherentes, con mobiliario a medida.', 'media_id' => $secondary->id, 'url' => $secondary->url],
                    ['number' => '03', 'title' => 'Espacio público', 'description' => 'Diseñamos lo que ocurre entre los edificios y el paisaje.', 'media_id' => $primary->id, 'url' => $primary->url],
                    ['number' => '04', 'title' => 'Dirección de obra', 'description' => 'Supervisión semanal, control de acabados y cierre técnico.', 'media_id' => $secondary->id, 'url' => $secondary->url],
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
            $this->info('HomeContent creado.');
        } else {
            $this->line('HomeContent ya existia, no se toco.');
        }

        if (AboutContent::query()->doesntExist()) {
            AboutContent::create([
                'hero_image_id' => $primary->id,
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
                'detail_image_id' => $secondary->id,
                'cta_label' => 'Conversemos un proyecto',
            ]);
            $this->info('AboutContent creado.');
        } else {
            $this->line('AboutContent ya existia, no se toco.');
        }

        if (ContactContent::query()->doesntExist()) {
            ContactContent::create([
                'address' => "Av. Pedro de Osma 214, piso 3\nBarranco, Lima, Perú",
                'email' => 'estudio@kreanddo.com',
                'phone' => '+51 1 234 567',
                'hours' => "Lunes a viernes\n9:00 — 18:00",
            ]);
            $this->info('ContactContent creado (datos de ejemplo: reemplazar en el admin).');
        } else {
            $this->line('ContactContent ya existia, no se toco.');
        }

        if (SiteSetting::query()->doesntExist()) {
            SiteSetting::create([
                'site_name' => 'KreanDDo Arquitectos',
                'site_url' => 'https://www.kreanddo.com',
                'default_seo_description' => 'Estudio de arquitectura en Lima: vivienda, comercio, interiorismo y espacio público.',
                'whatsapp_message_template' => 'Hola {nombre}, te escribo de KreanDDo Arquitectos por tu consulta sobre {tipo_proyecto}. ¿Tienes unos minutos para conversar?',
            ]);
            $this->info('SiteSetting creado (site_url de ejemplo: confirmar el dominio real).');
        } else {
            $this->line('SiteSetting ya existia, no se toco.');
        }

        return self::SUCCESS;
    }
}
