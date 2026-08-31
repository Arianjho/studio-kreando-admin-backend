<?php

namespace Database\Factories;

use App\Models\Consulta;
use App\Models\ConsultaWhatsappMessage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConsultaWhatsappMessage>
 */
class ConsultaWhatsappMessageFactory extends Factory
{
    protected $model = ConsultaWhatsappMessage::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'consulta_id' => Consulta::factory(),
            'user_id' => User::factory(),
            'to_number' => '51'.$this->faker->numberBetween(900_000_000, 999_999_999),
            'body' => $this->faker->sentence(),
            'status' => 'sent',
            'provider_response' => null,
        ];
    }

    public function failed(): static
    {
        return $this->state(fn () => ['status' => 'failed', 'provider_response' => 'connection refused']);
    }
}
