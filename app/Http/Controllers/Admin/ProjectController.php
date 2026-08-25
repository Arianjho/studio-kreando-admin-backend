<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Media;
use App\Models\Project;
use App\Services\MediaUploadService;
use App\Services\RevalidateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => Project::query()->with(['category', 'cover'])->orderBy('order')->get(),
            'categories' => Category::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateProject($request, true);

        $cover = MediaUploadService::store($request->file('cover'), $data['cover_alt']);

        Project::create([
            ...$this->baseFields($data),
            'cover_id' => $cover->id,
            'cover_alt' => $data['cover_alt'],
            'gallery' => $this->resolveGallery($request),
        ]);

        RevalidateService::trigger('projects');

        return back()->with('success', 'Proyecto creado correctamente');
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $data = $this->validateProject($request, false);

        $payload = [
            ...$this->baseFields($data),
            'cover_alt' => $data['cover_alt'],
            'gallery' => $this->resolveGallery($request),
        ];

        if ($request->hasFile('cover')) {
            $payload['cover_id'] = MediaUploadService::store($request->file('cover'), $data['cover_alt'])->id;
        }

        $project->update($payload);

        RevalidateService::trigger('projects');
        RevalidateService::trigger("project:{$project->slug}");

        return back()->with('success', 'Proyecto actualizado correctamente');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        RevalidateService::trigger('projects');

        return back()->with('success', 'Proyecto eliminado correctamente');
    }

    protected function validateProject(Request $request, bool $isCreate): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required', 'string', 'max:255', 'alpha_dash',
                Rule::unique('projects', 'slug')->ignore($request->route('project')),
            ],
            'category_id' => ['required', 'exists:categories,id'],
            'year' => ['required', 'integer', 'min:1900', 'max:2100'],
            'location' => ['required', 'string', 'max:255'],
            'area' => ['required', 'string', 'max:255'],
            'program' => ['required', 'string', 'max:255'],
            'team' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:Construido,En obra,En proyecto'],
            'intro' => ['required', 'string'],
            'body' => ['required', 'string'],
            'cover' => [$isCreate ? 'required' : 'nullable', 'image', 'max:5120'],
            'cover_alt' => ['required', 'string', 'max:255'],
            'featured' => ['nullable', 'boolean'],
            'order' => ['nullable', 'integer'],
            'existing_gallery' => ['nullable', 'string'],
            'new_gallery' => ['array'],
            'new_gallery.*' => ['image', 'max:5120'],
            'new_gallery_alt' => ['array'],
            'new_gallery_alt.*' => ['nullable', 'string', 'max:255'],
        ]);
    }

    protected function baseFields(array $data): array
    {
        return [
            'name' => $data['name'],
            'slug' => $data['slug'],
            'category_id' => $data['category_id'],
            'year' => $data['year'],
            'location' => $data['location'],
            'area' => $data['area'],
            'program' => $data['program'],
            'team' => $data['team'],
            'status' => $data['status'],
            'intro' => $data['intro'],
            'body' => $data['body'],
            'featured' => $data['featured'] ?? false,
            'order' => $data['order'] ?? 0,
        ];
    }

    protected function resolveGallery(Request $request): array
    {
        $existing = json_decode($request->input('existing_gallery', '[]'), true) ?: [];

        $gallery = collect($existing)
            ->map(function ($item) {
                $media = Media::find($item['media_id'] ?? null);

                if (! $media) {
                    return null;
                }

                return [
                    'media_id' => $media->id,
                    'url' => $media->url,
                    'alt' => $item['alt'] ?: $media->alt,
                ];
            })
            ->filter()
            ->values()
            ->all();

        $newFiles = $request->file('new_gallery', []);
        $newAlts = $request->input('new_gallery_alt', []);

        foreach ($newFiles as $index => $file) {
            $media = MediaUploadService::store($file, $newAlts[$index] ?? $file->getClientOriginalName());
            $gallery[] = ['media_id' => $media->id, 'url' => $media->url, 'alt' => $media->alt];
        }

        return $gallery;
    }
}
