<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $options = config('contact-form.options');

        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'project_type' => $this->faker->randomElement($options['project_type']),
            'intervention' => $this->faker->randomElement($options['intervention']),
            'location' => $this->faker->city(),
            'services' => $this->faker->randomElements($options['service'], 2),
            'budget' => $this->faker->randomElement($options['budget']),
            'timeline' => $this->faker->randomElement($options['timeline']),
            'message' => $this->faker->paragraph(),
            'read' => false,
        ];
    }
}
