<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreMessageRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $message = Message::create($request->validated());

        return ApiResponse::created([
            'id' => $message->id,
        ], 'Mensaje enviado correctamente, nos pondremos en contacto pronto');
    }
}
