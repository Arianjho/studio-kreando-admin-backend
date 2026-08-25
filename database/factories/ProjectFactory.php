<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Media;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->unique()->sentence(3);

        return [
            'slug' => \Illuminate\Support\Str::slug($name).'-'.$this->faker->unique()->numberBetween(1, 100000),
            'name' => $name,
            'category_id' => Category::factory(),
            'year' => $this->faker->numberBetween(2015, 2026),
            'location' => $this->faker->city(),
            'area' => $this->faker->numberBetween(50, 5000).' m2',
            'program' => $this->faker->word(),
            'team' => $this->faker->name(),
            'status' => $this->faker->randomElement(['Construido', 'En obra', 'En proyecto']),
            'intro' => $this->faker->paragraph(),
            'body' => $this->faker->paragraphs(3, true),
            'cover_id' => Media::factory(),
            'cover_alt' => $this->faker->sentence(4),
            'gallery' => [],
            'featured' => false,
            'order' => 0,
        ];
    }
}
