<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\ContactContent;
use App\Models\ContactFormOption;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

#[Group('Contenido', 'Paginas de contenido singleton (una sola fila por pagina).')]
class ContactController extends Controller
{
    public function show(): JsonResponse
    {
        $contact = ContactContent::first();

        if (! $contact) {
            return ApiResponse::notFound('El contenido de la pagina de contacto aun no fue configurado');
        }

        return ApiResponse::success([
            'address' => $contact->address,
            'email' => $contact->email,
            'phone' => $contact->phone,
            'hours' => $contact->hours,
            'form' => ContactFormOption::grouped(),
        ]);
    }
}
