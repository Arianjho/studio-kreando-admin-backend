<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.projects.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_projects(): void
    {
        $user = User::factory()->create();
        Project::factory()->count(2)->create();

        $response = $this->actingAs($user)->get(route('admin.projects.index'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_create_project(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.projects.store'), [
            'name' => 'Casa Adobe',
            'slug' => 'casa-adobe',
            'category_id' => $category->id,
            'year' => 2025,
            'location' => 'Lima',
            'area' => '400 m2',
            'program' => 'Vivienda',
            'team' => 'Equipo A',
            'status' => 'Construido',
            'intro' => 'Intro del proyecto',
            'body' => 'Cuerpo del proyecto',
            'cover' => UploadedFile::fake()->image('cover.jpg'),
            'cover_alt' => 'Portada de Casa Adobe',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('projects', ['slug' => 'casa-adobe', 'name' => 'Casa Adobe']);
    }

    public function test_project_requires_required_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.projects.store'), []);

        $response->assertSessionHasErrors([
            'name', 'slug', 'category_id', 'year', 'location', 'area', 'program', 'team', 'status', 'intro', 'body', 'cover', 'cover_alt',
        ]);
    }

    public function test_authenticated_user_can_update_project_without_replacing_cover(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $project = Project::factory()->create(['name' => 'Nombre viejo']);

        $response = $this->actingAs($user)->put(route('admin.projects.update', $project), [
            'name' => 'Nombre nuevo',
            'slug' => $project->slug,
            'category_id' => $project->category_id,
            'year' => $project->year,
            'location' => $project->location,
            'area' => $project->area,
            'program' => $project->program,
            'team' => $project->team,
            'status' => $project->status,
            'intro' => $project->intro,
            'body' => $project->body,
            'cover_alt' => $project->cover_alt,
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('Nombre nuevo', $project->fresh()->name);
    }

    public function test_authenticated_user_can_delete_project(): void
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.projects.destroy', $project));

        $response->assertRedirect();

        $this->assertSoftDeleted($project);
    }
}
