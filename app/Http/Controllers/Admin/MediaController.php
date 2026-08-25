<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\MediaUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MediaController extends Controller
{
    public function index(): Response
    {
        $media = Media::query()->latest()->paginate(24)->withQueryString();

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'file' => ['required', 'image', 'max:5120'],
            'alt' => ['required', 'string', 'max:255'],
        ]);

        MediaUploadService::store($data['file'], $data['alt']);

        return back()->with('success', 'Archivo subido correctamente');
    }

    public function update(Request $request, Media $medium): RedirectResponse
    {
        $data = $request->validate([
            'alt' => ['required', 'string', 'max:255'],
        ]);

        $medium->update($data);

        return back()->with('success', 'Archivo actualizado correctamente');
    }

    public function destroy(Media $medium): RedirectResponse
    {
        $medium->delete();

        return back()->with('success', 'Archivo eliminado correctamente');
    }
}
