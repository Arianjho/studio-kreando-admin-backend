<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ProjectResource;
use App\Http\Responses\ApiResponse;
use App\Models\Project;
use Dedoc\Scramble\Attributes\Group;
use Dedoc\Scramble\Attributes\PathParameter;
use Dedoc\Scramble\Attributes\QueryParameter;
use Dedoc\Scramble\Attributes\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

#[Group('Proyectos', 'Portafolio de proyectos publicados (portada + galeria).')]
class ProjectController extends Controller
{
    #[QueryParameter('featured', 'Devuelve solo los proyectos destacados.', type: 'bool', example: true)]
    #[QueryParameter('category', 'Filtra por nombre exacto de categoria.', type: 'string', example: 'Residencial')]
    public function index(Request $request): JsonResponse
    {
        $query = Project::query()->with(['category', 'cover'])->orderBy('order');

        if ($request->boolean('featured')) {
            $query->where('featured', true);
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('name', $category));
        }

        $projects = $query->get();

        return ApiResponse::success(ProjectResource::collection($projects));
    }

    #[PathParameter('project', 'Slug del proyecto.', type: 'string', example: 'casa-del-lago')]
    #[Response(404, 'No existe un proyecto con ese slug.')]
    public function show(Project $project): JsonResponse
    {
        $project->load(['category', 'cover']);

        return ApiResponse::success(new ProjectResource($project));
    }
}
