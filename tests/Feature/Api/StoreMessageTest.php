<?php

namespace Tests\Feature\Api;

use App\Models\ContactFormOption;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreMessageTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ana Torres',
            'email' => 'ana@example.com',
            'project_type' => 'Vivienda',
            'intervention' => 'Obra nueva',
            'location' => 'Barranco, Lima',
            'services' => ['Anteproyecto y diseño', 'Dirección de obra'],
            'budget' => 'S/ 80 – 200 mil',
            'timeline' => 'En los próximos 6 meses',
            'message' => 'Terreno de 300 m² en pendiente, familia de cuatro.',
        ], $overrides);
    }

    public function test_public_can_submit_a_full_contact_message(): void
    {
        $response = $this->postJson('/api/v1/messages', $this->payload());

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['id']]);

        $message = Message::sole();
        $this->assertSame('Vivienda', $message->project_type);
        $this->assertSame('Barranco, Lima', $message->location);
        $this->assertSame(['Anteproyecto y diseño', 'Dirección de obra'], $message->services);
        $this->assertSame('S/ 80 – 200 mil', $message->budget);
        $this->assertFalse($message->read);
    }

    public function test_the_structured_fields_are_optional_except_project_type(): void
    {
        $response = $this->postJson('/api/v1/messages', [
            'name' => 'Luis',
            'email' => 'luis@example.com',
            'project_type' => 'Interiorismo',
            'message' => 'Quiero renovar un departamento pequeño.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('messages', ['email' => 'luis@example.com', 'project_type' => 'Interiorismo']);
    }

    public function test_project_type_is_required_and_must_be_a_known_option(): void
    {
        $this->postJson('/api/v1/messages', $this->payload(['project_type' => null]))
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonValidationErrors('project_type');

        $this->postJson('/api/v1/messages', $this->payload(['project_type' => 'Nave espacial']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('project_type');
    }

    public function test_rejects_unknown_service_and_budget_values(): void
    {
        $this->postJson('/api/v1/messages', $this->payload(['services' => ['Consultoría feng shui']]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('services.0');

        $this->postJson('/api/v1/messages', $this->payload(['budget' => '10 dólares']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('budget');
    }

    public function test_validation_follows_the_admin_managed_option_lists(): void
    {
        // Only these two project types exist -> "Vivienda" (a config default) is now invalid.
        ContactFormOption::factory()->group('project_type')->create(['label' => 'Náutico']);
        ContactFormOption::factory()->group('project_type')->create(['label' => 'Educativo']);

        $this->postJson('/api/v1/messages', $this->payload(['project_type' => 'Vivienda']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('project_type');

        $this->postJson('/api/v1/messages', $this->payload(['project_type' => 'Náutico', 'services' => [], 'budget' => null, 'timeline' => null, 'intervention' => null]))
            ->assertCreated();
    }

    public function test_message_endpoint_is_throttled(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/v1/messages', $this->payload(['email' => "user{$i}@example.com"]))
                ->assertCreated();
        }

        $this->postJson('/api/v1/messages', $this->payload(['email' => 'flood@example.com']))
            ->assertStatus(429);
    }
}
