<?php

namespace Database\Factories;

use App\Models\Media;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Media>
 */
class MediaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'disk' => 'public',
            'path' => 'media/'.$this->faker->uuid().'.jpg',
            'alt' => $this->faker->sentence(4),
            'mime_type' => 'image/jpeg',
            'size' => $this->faker->numberBetween(10000, 500000),
        ];
    }
}
