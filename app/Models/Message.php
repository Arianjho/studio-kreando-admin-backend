<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'project_type',
        'intervention',
        'location',
        'services',
        'budget',
        'timeline',
        'message',
        'read',
    ];

    protected $casts = [
        'services' => 'array',
        'read' => 'boolean',
    ];
}
