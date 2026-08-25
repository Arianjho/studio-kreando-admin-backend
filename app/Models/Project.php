<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    /** @use HasFactory<\Database\Factories\ProjectFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'slug', 'name', 'category_id', 'year', 'location', 'area', 'program',
        'team', 'status', 'intro', 'body', 'cover_id', 'cover_alt', 'gallery',
        'featured', 'order',
    ];

    protected $casts = [
        'gallery' => 'array',
        'featured' => 'boolean',
        'year' => 'integer',
        'order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function cover(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'cover_id');
    }
}
