<?php

namespace Tests\Feature\Admin;

use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $response = $this->get(route('admin.media.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_media(): void
    {
        $user = User::factory()->create();
        Media::factory()->count(3)->create();

        $response = $this->actingAs($user)->get(route('admin.media.index'));

        $response->assertOk();
    }

    public function test_authenticated_user_can_upload_media(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.media.store'), [
            'file' => UploadedFile::fake()->image('foto.jpg', 800, 600),
            'alt' => 'Texto alternativo',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();

        $this->assertDatabaseHas('media', [
            'alt' => 'Texto alternativo',
            'width' => 800,
            'height' => 600,
        ]);
    }

    public function test_authenticated_user_can_update_media_alt_text(): void
    {
        $user = User::factory()->create();
        $media = Media::factory()->create(['alt' => 'Antiguo']);

        $response = $this->actingAs($user)->put(route('admin.media.update', $media), [
            'alt' => 'Nuevo texto',
        ]);

        $response->assertSessionHasNoErrors();

        $this->assertSame('Nuevo texto', $media->fresh()->alt);
    }

    public function test_authenticated_user_can_delete_media(): void
    {
        $user = User::factory()->create();
        $media = Media::factory()->create();

        $response = $this->actingAs($user)->delete(route('admin.media.destroy', $media));

        $response->assertRedirect();

        $this->assertSoftDeleted($media);
    }
}
