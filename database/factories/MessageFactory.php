<?php

namespace Database\Factories;

use App\Http\Requests\Api\StoreMessageRequest;
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
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'project_type' => $this->faker->randomElement(StoreMessageRequest::PROJECT_TYPES),
            'intervention' => $this->faker->randomElement(StoreMessageRequest::INTERVENTIONS),
            'location' => $this->faker->city(),
            'services' => $this->faker->randomElements(StoreMessageRequest::SERVICES, 2),
            'budget' => $this->faker->randomElement(StoreMessageRequest::BUDGETS),
            'timeline' => $this->faker->randomElement(StoreMessageRequest::TIMELINES),
            'message' => $this->faker->paragraph(),
            'read' => false,
        ];
    }
}
