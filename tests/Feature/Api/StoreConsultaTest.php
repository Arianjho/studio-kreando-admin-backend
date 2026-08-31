<?php

namespace Tests\Feature\Api;

use App\Models\Consulta;
use App\Models\ContactFormOption;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreConsultaTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Ana Torres',
            'phone' => '987654321',
            'project_type' => 'Vivienda',
            'intervention' => 'Obra nueva',
            'location' => 'Barranco, Lima',
            'services' => ['Anteproyecto y diseño', 'Dirección de obra'],
            'budget' => 'S/ 80 – 200 mil',
            'timeline' => 'En los próximos 6 meses',
            'message' => 'Terreno de 300 m² en pendiente, familia de cuatro.',
        ], $overrides);
    }

    public function test_public_can_submit_a_full_contact_consulta(): void
    {
        $response = $this->postJson('/api/v1/consultas', $this->payload());

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonStructure(['data' => ['id']]);

        $consulta = Consulta::sole();
        $this->assertSame('987654321', $consulta->phone);
        $this->assertSame('Vivienda', $consulta->project_type);
        $this->assertSame('Barranco, Lima', $consulta->location);
        $this->assertSame(['Anteproyecto y diseño', 'Dirección de obra'], $consulta->services);
        $this->assertFalse($consulta->read);
        $this->assertNull($consulta->responded_at);
    }

    public function test_the_structured_fields_are_optional_except_project_type(): void
    {
        $response = $this->postJson('/api/v1/consultas', [
            'name' => 'Luis',
            'phone' => '900111222',
            'project_type' => 'Interiorismo',
            'message' => 'Quiero renovar un departamento pequeño.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('consultas', ['phone' => '900111222', 'project_type' => 'Interiorismo']);
    }

    public function test_phone_is_required_and_must_have_nine_digits(): void
    {
        $this->postJson('/api/v1/consultas', $this->payload(['phone' => null]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('phone');

        $this->postJson('/api/v1/consultas', $this->payload(['phone' => '12345']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('phone');

        $this->postJson('/api/v1/consultas', $this->payload(['phone' => '9876543210']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('phone');
    }

    public function test_project_type_is_required_and_must_be_a_known_option(): void
    {
        $this->postJson('/api/v1/consultas', $this->payload(['project_type' => null]))
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonValidationErrors('project_type');

        $this->postJson('/api/v1/consultas', $this->payload(['project_type' => 'Nave espacial']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('project_type');
    }

    public function test_rejects_unknown_service_and_budget_values(): void
    {
        $this->postJson('/api/v1/consultas', $this->payload(['services' => ['Consultoría feng shui']]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('services.0');

        $this->postJson('/api/v1/consultas', $this->payload(['budget' => '10 dólares']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('budget');
    }

    public function test_validation_follows_the_admin_managed_option_lists(): void
    {
        ContactFormOption::factory()->group('project_type')->create(['label' => 'Náutico']);
        ContactFormOption::factory()->group('project_type')->create(['label' => 'Educativo']);

        $this->postJson('/api/v1/consultas', $this->payload(['project_type' => 'Vivienda']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('project_type');

        $this->postJson('/api/v1/consultas', $this->payload(['project_type' => 'Náutico', 'services' => [], 'budget' => null, 'timeline' => null, 'intervention' => null]))
            ->assertCreated();
    }

    public function test_consulta_endpoint_is_throttled(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/v1/consultas', $this->payload(['phone' => (string) (900000000 + $i)]))
                ->assertCreated();
        }

        $this->postJson('/api/v1/consultas', $this->payload(['phone' => '999999999']))
            ->assertStatus(429);
    }
}
