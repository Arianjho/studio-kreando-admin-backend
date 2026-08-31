<?php

namespace Tests\Feature\Api;

use App\Models\ContactContent;
use App\Models\ContactFormOption;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_endpoint_returns_info_and_the_form_option_lists(): void
    {
        ContactContent::create([
            'address' => 'Barranco, Lima',
            'email' => 'estudio@kreanddo.com',
            'phone' => '+51 1 234 567',
            'hours' => 'Lun a Vie',
        ]);
        ContactFormOption::seedDefaults();
        ContactFormOption::factory()->group('project_type')->create(['label' => 'Hotelería', 'position' => 99]);

        $response = $this->getJson('/api/v1/contact')->assertOk();

        $response->assertJsonPath('data.email', 'estudio@kreanddo.com');
        foreach (ContactFormOption::GROUPS as $group) {
            $response->assertJsonStructure(['data' => ['form' => [$group]]]);
        }
        $this->assertContains('Hotelería', $response->json('data.form.project_type'));
    }

    public function test_form_lists_fall_back_to_config_defaults_when_the_table_is_empty(): void
    {
        ContactContent::create([
            'address' => 'x', 'email' => 'x@x.com', 'phone' => 'x', 'hours' => 'x',
        ]);

        $response = $this->getJson('/api/v1/contact')->assertOk();

        $this->assertSame(
            config('contact-form.options.timeline'),
            $response->json('data.form.timeline'),
        );
    }
}
