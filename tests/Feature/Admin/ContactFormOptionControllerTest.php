<?php

namespace Tests\Feature\Admin;

use App\Models\ContactFormOption;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactFormOptionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('admin.content.form-options'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_view_the_options(): void
    {
        ContactFormOption::seedDefaults();
        $user = User::factory()->create();

        $this->actingAs($user)->get(route('admin.content.form-options'))->assertOk();
    }

    public function test_authenticated_user_can_add_an_option_to_a_group(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('admin.content.form-options.store'), [
            'group' => 'budget',
            'label' => 'Más de S/ 5 millones',
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect();
        $this->assertDatabaseHas('contact_form_options', [
            'group' => 'budget',
            'label' => 'Más de S/ 5 millones',
        ]);
    }

    public function test_a_new_option_lands_after_the_existing_ones_in_its_group(): void
    {
        ContactFormOption::seedDefaults();
        $user = User::factory()->create();
        $lastPosition = ContactFormOption::group('service')->max('position');

        $this->actingAs($user)->post(route('admin.content.form-options.store'), [
            'group' => 'service',
            'label' => 'Paisajismo',
        ]);

        $this->assertSame(
            $lastPosition + 1,
            ContactFormOption::where('label', 'Paisajismo')->value('position'),
        );
    }

    public function test_group_must_be_one_of_the_known_groups(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.content.form-options.store'), ['group' => 'colour', 'label' => 'Azul'])
            ->assertSessionHasErrors('group');
    }

    public function test_authenticated_user_can_rename_and_delete_an_option(): void
    {
        $user = User::factory()->create();
        $option = ContactFormOption::factory()->group('timeline')->create(['label' => 'Antiguo']);

        $this->actingAs($user)
            ->put(route('admin.content.form-options.update', $option), ['label' => 'Nuevo'])
            ->assertSessionHasNoErrors();
        $this->assertSame('Nuevo', $option->fresh()->label);

        $this->actingAs($user)
            ->delete(route('admin.content.form-options.destroy', $option))
            ->assertRedirect();
        $this->assertSoftDeleted($option);
    }
}
