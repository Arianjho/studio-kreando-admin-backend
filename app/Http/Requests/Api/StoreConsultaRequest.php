<?php

namespace App\Http\Requests\Api;

use App\Models\ContactFormOption;
use Illuminate\Validation\Rule;

class StoreConsultaRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $options = ContactFormOption::grouped();

        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^\d{9}$/'],
            'project_type' => ['required', Rule::in($options['project_type'])],
            'intervention' => ['nullable', Rule::in($options['intervention'])],
            'location' => ['nullable', 'string', 'max:255'],
            'services' => ['nullable', 'array'],
            'services.*' => [Rule::in($options['service'])],
            'budget' => ['nullable', Rule::in($options['budget'])],
            'timeline' => ['nullable', Rule::in($options['timeline'])],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.regex' => 'El teléfono debe tener 9 dígitos.',
        ];
    }
}
