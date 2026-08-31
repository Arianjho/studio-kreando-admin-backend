<?php

namespace Database\Factories;

use App\Models\ContactFormOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactFormOption>
 */
class ContactFormOptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'group' => $this->faker->randomElement(ContactFormOption::GROUPS),
            'label' => ucfirst($this->faker->unique()->words(2, true)),
            'position' => $this->faker->numberBetween(0, 10),
        ];
    }

    public function group(string $group): static
    {
        return $this->state(fn () => ['group' => $group]);
    }
}
