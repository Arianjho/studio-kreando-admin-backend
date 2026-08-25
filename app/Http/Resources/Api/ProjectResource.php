<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'year' => $this->year,
            'location' => $this->location,
            'area' => $this->area,
            'program' => $this->program,
            'team' => $this->team,
            'status' => $this->status,
            'intro' => $this->intro,
            'body' => $this->body,
            'cover' => new MediaResource($this->whenLoaded('cover')),
            'cover_alt' => $this->cover_alt,
            'gallery' => $this->gallery ?? [],
            'featured' => $this->featured,
            'order' => $this->order,
        ];
    }
}
