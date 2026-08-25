<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\HomeContentResource;
use App\Http\Responses\ApiResponse;
use App\Models\HomeContent;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function show(): JsonResponse
    {
        $home = HomeContent::with('heroImage')->first();

        if (! $home) {
            return ApiResponse::notFound('El contenido de la pagina de inicio aun no fue configurado');
        }

        return ApiResponse::success(new HomeContentResource($home));
    }
}
