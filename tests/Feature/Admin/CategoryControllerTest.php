<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.categories.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_categories(): void
    {
        $user = User::factory()->create();
        Category::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('admin.categories.index'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_create_category(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.categories.store'), [
            'name' => 'Residencial',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('categories', ['name' => 'Residencial']);
    }

    public function test_category_name_is_required(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.categories.store'), [
            'name' => '',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_category_name_must_be_unique(): void
    {
        $user = User::factory()->create();
        Category::factory()->create(['name' => 'Comercial']);

        $response = $this->actingAs($user)->post(route('admin.categories.store'), [
            'name' => 'Comercial',
        ]);

        $response->assertSessionHasErrors('name');
    }

    public function test_authenticated_user_can_update_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['name' => 'Antiguo']);

        $response = $this->actingAs($user)->put(route('admin.categories.update', $category), [
            'name' => 'Nuevo nombre',
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('Nuevo nombre', $category->fresh()->name);
    }

    public function test_authenticated_user_can_delete_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.categories.destroy', $category));

        $response->assertRedirect();

        $this->assertSoftDeleted($category);
    }
}
