<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AboutContent;
use App\Services\MediaUploadService;
use App\Services\RevalidateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AboutContentController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Content/About', [
            'content' => AboutContent::with(['heroImage', 'detailImage'])->firstOrFail(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'hero_headline' => ['required', 'string', 'max:255'],
            'hero_subtext' => ['required', 'string'],
            'hero_alt' => ['nullable', 'string', 'max:255'],
            'hero_image' => ['nullable', 'image', 'max:5120'],
            'detail_alt' => ['nullable', 'string', 'max:255'],
            'detail_image' => ['nullable', 'image', 'max:5120'],
            'intro_paragraphs' => ['required', 'string'],
            'services' => ['required', 'string'],
            'milestones' => ['required', 'string'],
            'cta_label' => ['required', 'string', 'max:255'],
        ]);

        $content = AboutContent::firstOrFail();

        $payload = [
            'hero_headline' => $data['hero_headline'],
            'hero_subtext' => $data['hero_subtext'],
            'intro_paragraphs' => json_decode($data['intro_paragraphs'], true) ?: [],
            'services' => json_decode($data['services'], true) ?: [],
            'milestones' => json_decode($data['milestones'], true) ?: [],
            'cta_label' => $data['cta_label'],
        ];

        if ($request->hasFile('hero_image')) {
            $media = MediaUploadService::store($request->file('hero_image'), $data['hero_alt'] ?? $data['hero_headline']);
            $payload['hero_image_id'] = $media->id;
        }

        if ($request->hasFile('detail_image')) {
            $media = MediaUploadService::store($request->file('detail_image'), $data['detail_alt'] ?? $data['hero_headline']);
            $payload['detail_image_id'] = $media->id;
        }

        $content->update($payload);

        RevalidateService::trigger('about');

        return back()->with('success', 'Contenido de nosotros actualizado correctamente');
    }
}
