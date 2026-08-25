<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = SiteSetting::first();

        if (! $settings) {
            return ApiResponse::notFound('La configuracion del sitio aun no fue configurada');
        }

        return ApiResponse::success([
            'site_name' => $settings->site_name,
            'site_url' => $settings->site_url,
            'default_seo_description' => $settings->default_seo_description,
        ]);
    }
}
