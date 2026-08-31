<?php

namespace Database\Factories;

use App\Models\Consulta;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Consulta>
 */
class ConsultaFactory extends Factory
{
    protected $model = Consulta::class;

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
            'phone' => (string) $this->faker->numberBetween(900_000_000, 999_999_999),
            'project_type' => $this->faker->randomElement($options['project_type']),
            'intervention' => $this->faker->randomElement($options['intervention']),
            'location' => $this->faker->city(),
            'services' => $this->faker->randomElements($options['service'], 2),
            'budget' => $this->faker->randomElement($options['budget']),
            'timeline' => $this->faker->randomElement($options['timeline']),
            'message' => $this->faker->paragraph(),
            'read' => false,
            'responded_at' => null,
        ];
    }

    public function responded(): static
    {
        return $this->state(fn () => ['read' => true, 'responded_at' => now()]);
    }
}
