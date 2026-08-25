<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ProjectResource;
use App\Http\Responses\ApiResponse;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
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

    public function show(Project $project): JsonResponse
    {
        $project->load(['category', 'cover']);

        return ApiResponse::success(new ProjectResource($project));
    }
}
