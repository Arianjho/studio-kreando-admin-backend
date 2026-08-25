<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.users.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_users(): void
    {
        $user = User::factory()->create();
        User::factory()->count(2)->create();

        $response = $this->actingAs($user)->get(route('admin.users.index'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_create_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.users.store'), [
            'name' => 'Nuevo Admin',
            'email' => 'nuevo@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('users', ['email' => 'nuevo@example.com']);
    }

    public function test_user_email_must_be_unique(): void
    {
        $user = User::factory()->create();
        User::factory()->create(['email' => 'existente@example.com']);

        $response = $this->actingAs($user)->post(route('admin.users.store'), [
            'name' => 'Otro',
            'email' => 'existente@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_authenticated_user_can_update_another_user(): void
    {
        $user = User::factory()->create();
        $target = User::factory()->create(['name' => 'Nombre viejo']);

        $response = $this->actingAs($user)->put(route('admin.users.update', $target), [
            'name' => 'Nombre nuevo',
            'email' => $target->email,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('Nombre nuevo', $target->fresh()->name);
    }

    public function test_authenticated_user_can_delete_another_user(): void
    {
        $user = User::factory()->create();
        $target = User::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.users.destroy', $target));

        $response->assertRedirect();

        $this->assertSoftDeleted($target);
    }

    public function test_user_cannot_delete_their_own_account(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.users.destroy', $user));

        $response->assertRedirect();

        $this->assertNotNull($user->fresh());
    }
}
