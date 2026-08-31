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
            'status' => 'nuevo',
            'responded_at' => null,
            'closed_at' => null,
        ];
    }

    public function contactado(): static
    {
        return $this->state(fn () => ['status' => 'contactado', 'responded_at' => now()]);
    }

    public function cerrado(): static
    {
        return $this->state(fn () => ['status' => 'cerrado', 'closed_at' => now()]);
    }
}
