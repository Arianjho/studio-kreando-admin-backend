<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreConsultaRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Consulta;
use Dedoc\Scramble\Attributes\Group;
use Dedoc\Scramble\Attributes\Response;
use Illuminate\Http\JsonResponse;

#[Group('Contacto', 'Formulario de contacto publico. Unica escritura sin autenticacion.')]
class ConsultaController extends Controller
{
    #[Response(429, 'Se supero el limite de 10 envios por minuto desde la misma IP.')]
    public function store(StoreConsultaRequest $request): JsonResponse
    {
        $consulta = Consulta::create($request->validated());

        return ApiResponse::created([
            'id' => $consulta->id,
        ], 'Consulta enviada correctamente, nos pondremos en contacto pronto');
    }
}
