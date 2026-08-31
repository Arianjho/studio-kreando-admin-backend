<?php

namespace App\Http\Requests\Api;

use Illuminate\Validation\Rule;

class StoreMessageRequest extends BaseApiRequest
{
    /** Canonical option lists for the public contact form. */
    public const PROJECT_TYPES = ['Vivienda', 'Comercial', 'Interiorismo', 'Espacio público', 'Otro'];

    public const INTERVENTIONS = [
        'Obra nueva',
        'Remodelación o ampliación',
        'Solo interiorismo',
        'Aún no lo sé',
    ];

    public const SERVICES = [
        'Anteproyecto y diseño',
        'Proyecto ejecutivo',
        'Dirección de obra',
        'Interiorismo y mobiliario',
        'Aún no estoy seguro',
    ];

    public const BUDGETS = [
        'Menos de S/ 10 mil',
        'S/ 10 – 30 mil',
        'S/ 30 – 80 mil',
        'S/ 80 – 200 mil',
        'S/ 200 – 500 mil',
        'Más de S/ 500 mil',
        'Prefiero conversarlo',
    ];

    public const TIMELINES = [
        'Lo antes posible',
        'En los próximos 6 meses',
        'En 6 – 12 meses',
        'Solo estoy explorando',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'project_type' => ['required', Rule::in(self::PROJECT_TYPES)],
            'intervention' => ['nullable', Rule::in(self::INTERVENTIONS)],
            'location' => ['nullable', 'string', 'max:255'],
            'services' => ['nullable', 'array'],
            'services.*' => [Rule::in(self::SERVICES)],
            'budget' => ['nullable', Rule::in(self::BUDGETS)],
            'timeline' => ['nullable', Rule::in(self::TIMELINES)],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }
}
