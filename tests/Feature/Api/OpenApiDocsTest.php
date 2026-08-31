<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OpenApiDocsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_api_docs_outside_local(): void
    {
        // El entorno de tests no es "local", por lo que aplica el gate viewApiDocs.
        $this->get(route('scramble.docs.ui'))->assertForbidden();
        $this->get(route('scramble.docs.document'))->assertForbidden();
    }

    public function test_authenticated_user_can_access_api_docs(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('scramble.docs.ui'))->assertOk();
        $this->actingAs($user)->get(route('scramble.docs.document'))->assertOk();
    }

    public function test_openapi_document_describes_every_public_endpoint(): void
    {
        $user = User::factory()->create();

        $document = $this->actingAs($user)
            ->getJson(route('scramble.docs.document'))
            ->assertOk()
            ->json();

        $paths = $document['paths'];

        $expected = [
            '/v1/categories' => ['get'],
            '/v1/projects' => ['get'],
            '/v1/projects/{project}' => ['get'],
            '/v1/home' => ['get'],
            '/v1/about' => ['get'],
            '/v1/contact' => ['get'],
            '/v1/site-settings' => ['get'],
            '/v1/messages' => ['post'],
        ];

        foreach ($expected as $path => $methods) {
            $this->assertArrayHasKey($path, $paths, "Falta la ruta {$path} en el documento OpenAPI");

            foreach ($methods as $method) {
                $this->assertArrayHasKey($method, $paths[$path], "Falta {$method} en {$path}");
            }
        }
    }

    public function test_project_list_documents_filter_query_parameters(): void
    {
        $user = User::factory()->create();

        $document = $this->actingAs($user)
            ->getJson(route('scramble.docs.document'))
            ->assertOk()
            ->json();

        $parameters = collect($document['paths']['/v1/projects']['get']['parameters'] ?? [])
            ->pluck('name')
            ->all();

        $this->assertContains('featured', $parameters);
        $this->assertContains('category', $parameters);
    }

    public function test_project_detail_documents_not_found_response(): void
    {
        $user = User::factory()->create();

        $document = $this->actingAs($user)
            ->getJson(route('scramble.docs.document'))
            ->assertOk()
            ->json();

        $responses = array_map(
            'strval',
            array_keys($document['paths']['/v1/projects/{project}']['get']['responses'] ?? [])
        );

        $this->assertContains('404', $responses);
    }

    public function test_message_endpoint_documents_validation_and_throttle_responses(): void
    {
        $user = User::factory()->create();

        $document = $this->actingAs($user)
            ->getJson(route('scramble.docs.document'))
            ->assertOk()
            ->json();

        $responses = array_map(
            'strval',
            array_keys($document['paths']['/v1/messages']['post']['responses'] ?? [])
        );

        $this->assertContains('201', $responses);
        $this->assertContains('422', $responses);
        $this->assertContains('429', $responses);
    }
}
