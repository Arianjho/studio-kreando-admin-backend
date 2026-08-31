<?php

namespace Tests\Feature\Admin;

use App\Models\Consulta;
use App\Models\User;
use App\Services\WhatsAppService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ConsultaControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.whatsapp', [
            'url' => 'https://wpp.test',
            'instance' => 'Personal',
            'api_key' => 'test-key',
            'verify_ssl' => false,
        ]);
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('admin.consultas.index'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_consultas(): void
    {
        $user = User::factory()->create();
        Consulta::factory()->count(3)->create();

        $this->actingAs($user)->get(route('admin.consultas.index'))->assertOk();
    }

    public function test_search_filters_by_name_phone_or_message_body(): void
    {
        $user = User::factory()->create();
        Consulta::factory()->create(['name' => 'Lucía Fernández', 'phone' => '987654321', 'message' => 'Casa de playa']);
        Consulta::factory()->create(['name' => 'Otro', 'phone' => '900000000', 'message' => 'Local comercial']);

        $this->actingAs($user)
            ->get(route('admin.consultas.index', ['search' => '987654321']))
            ->assertInertia(fn ($page) => $page
                ->has('consultas', 1)
                ->where('consultas.0.name', 'Lucía Fernández'));
    }

    public function test_status_filter_separates_nuevo_contactado_and_cerrado(): void
    {
        $user = User::factory()->create();
        Consulta::factory()->create();
        Consulta::factory()->contactado()->create();
        Consulta::factory()->cerrado()->create();

        foreach (['nuevo', 'contactado', 'cerrado'] as $status) {
            $this->actingAs($user)
                ->get(route('admin.consultas.index', ['status' => $status]))
                ->assertInertia(fn ($page) => $page->has('consultas', 1));
        }
    }

    public function test_index_exposes_whatsapp_template_and_enabled_flag(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.consultas.index'))
            ->assertInertia(fn ($page) => $page
                ->has('whatsappTemplate')
                ->where('whatsappEnabled', true));
    }

    public function test_authenticated_user_can_mark_consulta_closed_from_any_state(): void
    {
        $user = User::factory()->create();
        $nueva = Consulta::factory()->create();
        $contactada = Consulta::factory()->contactado()->create();

        foreach ([$nueva, $contactada] as $consulta) {
            $this->actingAs($user)->patch(route('admin.consultas.close', $consulta))->assertRedirect();

            $consulta->refresh();
            $this->assertSame('cerrado', $consulta->status);
            $this->assertNotNull($consulta->closed_at);
        }
    }

    public function test_authenticated_user_can_delete_consulta(): void
    {
        $user = User::factory()->create();
        $consulta = Consulta::factory()->create();

        $this->actingAs($user)->delete(route('admin.consultas.destroy', $consulta))->assertRedirect();

        $this->assertSoftDeleted($consulta);
    }

    public function test_sending_whatsapp_calls_evolution_api_and_marks_contactado(): void
    {
        Http::fake([
            'wpp.test/*' => Http::response(['key' => ['id' => 'ABC']], 201),
        ]);

        $user = User::factory()->create();
        $consulta = Consulta::factory()->create(['phone' => '987654321']);

        $this->actingAs($user)
            ->post(route('admin.consultas.whatsapp', $consulta), ['message' => 'Hola, te escribo por tu consulta.'])
            ->assertRedirect()
            ->assertSessionHas('success');

        Http::assertSent(function ($request) {
            return str_contains($request->url(), '/message/sendText/Personal')
                && $request['number'] === '51987654321'
                && $request['text'] === 'Hola, te escribo por tu consulta.'
                && $request->hasHeader('apikey', 'test-key');
        });

        $consulta->refresh();
        $this->assertNotNull($consulta->responded_at);
        $this->assertSame('contactado', $consulta->status);
        $this->assertDatabaseHas('consulta_whatsapp_messages', [
            'consulta_id' => $consulta->id,
            'user_id' => $user->id,
            'to_number' => '51987654321',
            'status' => 'sent',
        ]);
    }

    public function test_failed_whatsapp_send_is_logged_and_does_not_mark_responded(): void
    {
        Http::fake([
            'wpp.test/*' => Http::response(['error' => 'instance not connected'], 400),
        ]);

        $user = User::factory()->create();
        $consulta = Consulta::factory()->create(['phone' => '987654321']);

        $this->actingAs($user)
            ->post(route('admin.consultas.whatsapp', $consulta), ['message' => 'Hola'])
            ->assertRedirect()
            ->assertSessionHas('error');

        $consulta->refresh();
        $this->assertNull($consulta->responded_at);
        $this->assertSame('nuevo', $consulta->status);
        $this->assertDatabaseHas('consulta_whatsapp_messages', [
            'consulta_id' => $consulta->id,
            'status' => 'failed',
        ]);
    }

    public function test_whatsapp_send_requires_a_message(): void
    {
        $user = User::factory()->create();
        $consulta = Consulta::factory()->create(['phone' => '987654321']);

        $this->actingAs($user)
            ->post(route('admin.consultas.whatsapp', $consulta), ['message' => ''])
            ->assertSessionHasErrors('message');
    }

    public function test_whatsapp_send_rejects_a_consulta_without_a_valid_phone(): void
    {
        Http::fake();

        $user = User::factory()->create();
        $consulta = Consulta::factory()->create(['phone' => '']);

        $this->actingAs($user)
            ->post(route('admin.consultas.whatsapp', $consulta), ['message' => 'Hola'])
            ->assertSessionHas('error');

        Http::assertNothingSent();
    }

    public function test_whatsapp_send_is_unavailable_when_not_configured(): void
    {
        config()->set('services.whatsapp', ['url' => null, 'instance' => null, 'api_key' => null, 'verify_ssl' => true]);
        Http::fake();

        $user = User::factory()->create();
        $consulta = Consulta::factory()->create(['phone' => '987654321']);

        $this->actingAs($user)
            ->post(route('admin.consultas.whatsapp', $consulta), ['message' => 'Hola'])
            ->assertSessionHas('error');

        Http::assertNothingSent();
        $this->assertFalse(app(WhatsAppService::class)->isConfigured());
    }
}
