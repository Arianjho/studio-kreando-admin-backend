<?php

namespace Tests\Feature\Admin;

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.messages.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_messages(): void
    {
        $user = User::factory()->create();
        Message::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('admin.messages.index'));

        $response->assertOk();
    }

    public function test_search_filters_messages_by_name_email_or_message_body(): void
    {
        $user = User::factory()->create();
        Message::factory()->create(['name' => 'Lucía Fernández', 'email' => 'lucia@example.com', 'message' => 'Casa de playa']);
        Message::factory()->create(['name' => 'Otro', 'email' => 'otro@example.com', 'message' => 'Local comercial']);

        $this->actingAs($user)
            ->get(route('admin.messages.index', ['search' => 'lucia']))
            ->assertInertia(fn ($page) => $page
                ->where('messages.total', 1)
                ->where('messages.data.0.email', 'lucia@example.com'));
    }

    public function test_project_type_and_status_filters_narrow_the_list(): void
    {
        $user = User::factory()->create();
        Message::factory()->create(['project_type' => 'Vivienda', 'read' => false]);
        Message::factory()->create(['project_type' => 'Vivienda', 'read' => true]);
        Message::factory()->create(['project_type' => 'Comercial', 'read' => false]);

        $this->actingAs($user)
            ->get(route('admin.messages.index', ['project_type' => 'Vivienda']))
            ->assertInertia(fn ($page) => $page->where('messages.total', 2));

        $this->actingAs($user)
            ->get(route('admin.messages.index', ['project_type' => 'Vivienda', 'status' => 'new']))
            ->assertInertia(fn ($page) => $page->where('messages.total', 1));
    }

    public function test_index_exposes_the_managed_project_type_options_for_the_filter(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.messages.index'))
            ->assertInertia(fn ($page) => $page->has('projectTypes'));
    }

    public function test_authenticated_user_can_mark_message_as_read(): void
    {
        $user = User::factory()->create();
        $message = Message::factory()->create(['read' => false]);

        $response = $this->actingAs($user)->patch(route('admin.messages.read', $message));

        $response->assertRedirect();

        $this->assertTrue($message->fresh()->read);
    }

    public function test_authenticated_user_can_delete_message(): void
    {
        $user = User::factory()->create();
        $message = Message::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.messages.destroy', $message));

        $response->assertRedirect();

        $this->assertSoftDeleted($message);
    }
}
