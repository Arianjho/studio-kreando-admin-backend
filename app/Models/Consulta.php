<?php

namespace App\Models;

use Database\Factories\ConsultaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Consulta extends Model
{
    /** @use HasFactory<ConsultaFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'phone',
        'project_type',
        'intervention',
        'location',
        'services',
        'budget',
        'timeline',
        'message',
        'read',
        'responded_at',
    ];

    protected $casts = [
        'services' => 'array',
        'read' => 'boolean',
        'responded_at' => 'datetime',
    ];

    /**
     * @return HasMany<ConsultaWhatsappMessage, $this>
     */
    public function whatsappMessages(): HasMany
    {
        return $this->hasMany(ConsultaWhatsappMessage::class);
    }
}
