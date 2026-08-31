<?php

namespace Tests\Feature\Admin;

use App\Models\Category;
use App\Models\Message;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_guest_is_redirected_to_login(): void
    {
        $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_user_sees_dashboard_with_stats(): void
    {
        $user = User::factory()->create();

        $category = Category::factory()->create();
        Category::factory()->create();
        Project::factory()->count(3)->for($category)->create(['featured' => false]);
        Project::factory()->for($category)->create(['featured' => true]);
        Message::factory()->count(2)->create(['read' => false]);
        Message::factory()->create(['read' => true]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Dashboard')
                ->where('stats.unreadMessages', 2)
                ->where('stats.totalMessages', 3)
                ->where('stats.projects', 4)
                ->where('stats.featuredProjects', 1)
                ->where('stats.categories', 2)
                ->has('messagesByMonth', 6)
                ->has('recentMessages', 3)
            );
    }

    public function test_messages_by_month_buckets_counts_into_the_right_month(): void
    {
        Carbon::setTestNow('2026-06-15 12:00:00');

        $user = User::factory()->create();

        Message::factory()->count(2)->create(['created_at' => Carbon::now()]);
        Message::factory()->create(['created_at' => Carbon::now()->startOfMonth()->subMonths(2)]);
        // Fuera de la ventana de 6 meses: no debe contarse.
        Message::factory()->create(['created_at' => Carbon::now()->startOfMonth()->subMonths(9)]);

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertInertia(fn ($page) => $page
                ->where('messagesByMonth.5.value', 2)
                ->where('messagesByMonth.3.value', 1)
                ->where('messagesByMonth.0.value', 0)
                ->where('messagesByMonth.5.label', 'jun.')
            );
    }
}
