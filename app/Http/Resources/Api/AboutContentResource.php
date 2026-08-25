<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AboutContent */
class AboutContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'hero_image' => new MediaResource($this->whenLoaded('heroImage')),
            'hero_headline' => $this->hero_headline,
            'hero_subtext' => $this->hero_subtext,
            'intro_paragraphs' => $this->intro_paragraphs,
            'services' => $this->services,
            'milestones' => $this->milestones,
            'detail_image' => new MediaResource($this->whenLoaded('detailImage')),
            'cta_label' => $this->cta_label,
        ];
    }
}
