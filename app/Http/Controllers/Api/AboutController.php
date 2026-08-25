<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\AboutContentResource;
use App\Http\Responses\ApiResponse;
use App\Models\AboutContent;
use Illuminate\Http\JsonResponse;

class AboutController extends Controller
{
    public function show(): JsonResponse
    {
        $about = AboutContent::with(['heroImage', 'detailImage'])->first();

        if (! $about) {
            return ApiResponse::notFound('El contenido de la pagina nosotros aun no fue configurado');
        }

        return ApiResponse::success(new AboutContentResource($about));
    }
}
