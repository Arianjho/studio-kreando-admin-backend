<?php

namespace Tests\Feature\Admin;

use App\Models\AboutContent;
use App\Models\ContactContent;
use App\Models\HomeContent;
use App\Models\Media;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_for_every_content_page(): void
    {
        $this->get(route('admin.content.home'))->assertRedirect(route('login'));
        $this->get(route('admin.content.about'))->assertRedirect(route('login'));
        $this->get(route('admin.content.contact'))->assertRedirect(route('login'));
        $this->get(route('admin.content.settings'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_home_content(): void
    {
        $user = User::factory()->create();
        HomeContent::create($this->homeContentPayload());

        $response = $this->actingAs($user)->get(route('admin.content.home'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_update_home_content(): void
    {
        $user = User::factory()->create();
        $content = HomeContent::create($this->homeContentPayload());

        $response = $this->actingAs($user)->put(route('admin.content.home.update'), [
            'hero_headline' => 'Nuevo titular',
            'hero_subtext' => $content->hero_subtext,
            'hero_cta_primary_label' => $content->hero_cta_primary_label,
            'hero_cta_secondary_label' => $content->hero_cta_secondary_label,
            'about_heading' => $content->about_heading,
            'about_text' => $content->about_text,
            'about_cta_label' => $content->about_cta_label,
            'stats' => json_encode($content->stats),
            'services' => json_encode($content->services),
            'portfolio_heading' => $content->portfolio_heading,
            'portfolio_text' => $content->portfolio_text,
            'cta_heading' => $content->cta_heading,
            'cta_text' => $content->cta_text,
            'cta_button_label' => $content->cta_button_label,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('Nuevo titular', $content->fresh()->hero_headline);
    }

    public function test_authenticated_user_can_view_about_content(): void
    {
        $user = User::factory()->create();
        AboutContent::create($this->aboutContentPayload());

        $response = $this->actingAs($user)->get(route('admin.content.about'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_update_about_content(): void
    {
        $user = User::factory()->create();
        $content = AboutContent::create($this->aboutContentPayload());

        $response = $this->actingAs($user)->put(route('admin.content.about.update'), [
            'hero_headline' => 'Nuevo titular nosotros',
            'hero_subtext' => $content->hero_subtext,
            'intro_paragraphs' => json_encode($content->intro_paragraphs),
            'services' => json_encode($content->services),
            'milestones' => json_encode($content->milestones),
            'cta_label' => $content->cta_label,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('Nuevo titular nosotros', $content->fresh()->hero_headline);
    }

    public function test_authenticated_user_can_view_contact_content(): void
    {
        $user = User::factory()->create();
        ContactContent::create($this->contactContentPayload());

        $response = $this->actingAs($user)->get(route('admin.content.contact'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_update_contact_content(): void
    {
        $user = User::factory()->create();
        $content = ContactContent::create($this->contactContentPayload());

        $response = $this->actingAs($user)->put(route('admin.content.contact.update'), [
            'address' => $content->address,
            'email' => $content->email,
            'phone' => '+51 999 888 777',
            'hours' => $content->hours,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('+51 999 888 777', $content->fresh()->phone);
    }

    public function test_authenticated_user_can_view_settings_content(): void
    {
        $user = User::factory()->create();
        SiteSetting::create($this->siteSettingPayload());

        $response = $this->actingAs($user)->get(route('admin.content.settings'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_update_settings_content(): void
    {
        $user = User::factory()->create();
        $content = SiteSetting::create($this->siteSettingPayload());

        $response = $this->actingAs($user)->put(route('admin.content.settings.update'), [
            'site_name' => 'Nuevo nombre del sitio',
            'site_url' => $content->site_url,
            'default_seo_description' => $content->default_seo_description,
            'whatsapp_message_template' => $content->whatsapp_message_template,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('Nuevo nombre del sitio', $content->fresh()->site_name);
    }

    protected function homeContentPayload(): array
    {
        $media = Media::factory()->create();

        return [
            'hero_headline' => 'Titular',
            'hero_subtext' => 'Subtexto',
            'hero_image_id' => $media->id,
            'hero_cta_primary_label' => 'Primario',
            'hero_cta_secondary_label' => 'Secundario',
            'about_heading' => 'Sobre el estudio',
            'about_text' => 'Texto',
            'about_cta_label' => 'Conocer',
            'stats' => [['value' => '10', 'label' => 'Años']],
            'services' => [['number' => '01', 'title' => 'Diseño', 'description' => 'Desc']],
            'credits' => [],
            'portfolio_heading' => 'Portafolio',
            'portfolio_text' => 'Texto portafolio',
            'cta_heading' => 'CTA',
            'cta_text' => 'Texto CTA',
            'cta_button_label' => 'Botón',
        ];
    }

    protected function aboutContentPayload(): array
    {
        $hero = Media::factory()->create();
        $detail = Media::factory()->create();

        return [
            'hero_image_id' => $hero->id,
            'hero_headline' => 'Titular',
            'hero_subtext' => 'Subtexto',
            'intro_paragraphs' => [['text' => 'Parrafo']],
            'services' => [['number' => '01', 'title' => 'Servicio', 'description' => 'Desc']],
            'milestones' => [['year' => '2011', 'text' => 'Fundación']],
            'detail_image_id' => $detail->id,
            'cta_label' => 'Conversemos',
        ];
    }

    protected function contactContentPayload(): array
    {
        return [
            'address' => 'Av. Ejemplo 123',
            'email' => 'contacto@example.com',
            'phone' => '+51 1 234 567',
            'hours' => 'Lunes a viernes',
        ];
    }

    protected function siteSettingPayload(): array
    {
        return [
            'site_name' => 'Studio Kreando',
            'site_url' => 'https://www.example.com',
            'default_seo_description' => 'Descripción SEO',
            'whatsapp_message_template' => 'Hola {nombre}, te escribo por tu consulta.',
        ];
    }
}
