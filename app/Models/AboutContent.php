<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AboutContent extends Model
{
    protected $fillable = [
        'hero_image_id', 'hero_headline', 'hero_subtext', 'intro_paragraphs',
        'services', 'milestones', 'detail_image_id', 'cta_label',
    ];

    protected $casts = [
        'intro_paragraphs' => 'array',
        'services' => 'array',
        'milestones' => 'array',
    ];

    public function heroImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'hero_image_id');
    }

    public function detailImage(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'detail_image_id');
    }
}
