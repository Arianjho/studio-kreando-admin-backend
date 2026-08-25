<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeContent;
use App\Services\MediaUploadService;
use App\Services\RevalidateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeContentController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Content/Home', [
            'content' => HomeContent::with('heroImage')->firstOrFail(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'hero_headline' => ['required', 'string', 'max:255'],
            'hero_subtext' => ['required', 'string'],
            'hero_alt' => ['nullable', 'string', 'max:255'],
            'hero_image' => ['nullable', 'image', 'max:5120'],
            'hero_cta_primary_label' => ['required', 'string', 'max:255'],
            'hero_cta_secondary_label' => ['required', 'string', 'max:255'],
            'about_heading' => ['required', 'string', 'max:255'],
            'about_text' => ['required', 'string'],
            'about_cta_label' => ['required', 'string', 'max:255'],
            'stats' => ['required', 'string'],
            'services' => ['required', 'string'],
            'credits' => ['nullable', 'string'],
            'portfolio_heading' => ['required', 'string', 'max:255'],
            'portfolio_text' => ['required', 'string'],
            'cta_heading' => ['required', 'string', 'max:255'],
            'cta_text' => ['required', 'string'],
            'cta_button_label' => ['required', 'string', 'max:255'],
        ]);

        $content = HomeContent::firstOrFail();

        $services = collect(json_decode($data['services'], true) ?: [])
            ->values()
            ->map(function ($service, $index) use ($request) {
                $fileKey = "service_file_{$index}";

                if ($request->hasFile($fileKey)) {
                    $media = MediaUploadService::store($request->file($fileKey), $service['title'] ?? 'Servicio');
                    $service['media_id'] = $media->id;
                    $service['url'] = $media->url;
                }

                unset($service['file']);

                return $service;
            })
            ->all();

        $payload = [
            'hero_headline' => $data['hero_headline'],
            'hero_subtext' => $data['hero_subtext'],
            'hero_cta_primary_label' => $data['hero_cta_primary_label'],
            'hero_cta_secondary_label' => $data['hero_cta_secondary_label'],
            'about_heading' => $data['about_heading'],
            'about_text' => $data['about_text'],
            'about_cta_label' => $data['about_cta_label'],
            'stats' => json_decode($data['stats'], true) ?: [],
            'services' => $services,
            'credits' => json_decode($data['credits'] ?? '[]', true) ?: [],
            'portfolio_heading' => $data['portfolio_heading'],
            'portfolio_text' => $data['portfolio_text'],
            'cta_heading' => $data['cta_heading'],
            'cta_text' => $data['cta_text'],
            'cta_button_label' => $data['cta_button_label'],
        ];

        if ($request->hasFile('hero_image')) {
            $media = MediaUploadService::store($request->file('hero_image'), $data['hero_alt'] ?? $data['hero_headline']);
            $payload['hero_image_id'] = $media->id;
        }

        $content->update($payload);

        RevalidateService::trigger('home');

        return back()->with('success', 'Contenido de inicio actualizado correctamente');
    }
}
