<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomeContent extends Model
{
    protected $fillable = [
        'hero_headline', 'hero_subtext', 'hero_image_id', 'hero_cta_primary_label',
        'hero_cta_secondary_label', 'about_heading', 'about_text', 'about_cta_label',
        'stats', 'services', 'credits', 'portfolio_heading', 'portfolio_text',
        'cta_heading', 'cta_text', 'cta_button_label',
    ];

    protected $casts = [
        'stats' => 'array',
        'services' => 'array',
        'credits' => 'array',
    ];

    public function heroImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'hero_image_id');
    }
}
