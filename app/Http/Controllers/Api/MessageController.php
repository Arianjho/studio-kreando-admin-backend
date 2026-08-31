<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreMessageRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Message;
use Dedoc\Scramble\Attributes\Group;
use Dedoc\Scramble\Attributes\Response;
use Illuminate\Http\JsonResponse;

#[Group('Contacto', 'Formulario de contacto publico. Unica escritura sin autenticacion.')]
class MessageController extends Controller
{
    #[Response(429, 'Se supero el limite de 10 envios por minuto desde la misma IP.')]
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = Message::create($request->validated());

        return ApiResponse::created([
            'id' => $message->id,
        ], 'Mensaje enviado correctamente, nos pondremos en contacto pronto');
    }
}
