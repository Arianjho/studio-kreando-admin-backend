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
