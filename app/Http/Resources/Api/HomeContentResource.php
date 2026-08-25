<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\HomeContent */
class HomeContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'hero_headline' => $this->hero_headline,
            'hero_subtext' => $this->hero_subtext,
            'hero_image' => new MediaResource($this->whenLoaded('heroImage')),
            'hero_cta_primary_label' => $this->hero_cta_primary_label,
            'hero_cta_secondary_label' => $this->hero_cta_secondary_label,
            'about_heading' => $this->about_heading,
            'about_text' => $this->about_text,
            'about_cta_label' => $this->about_cta_label,
            'stats' => $this->stats,
            'services' => $this->services,
            'credits' => $this->credits ?? [],
            'portfolio_heading' => $this->portfolio_heading,
            'portfolio_text' => $this->portfolio_text,
            'cta_heading' => $this->cta_heading,
            'cta_text' => $this->cta_text,
            'cta_button_label' => $this->cta_button_label,
        ];
    }
}
