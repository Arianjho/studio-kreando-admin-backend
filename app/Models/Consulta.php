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

    public const STATUSES = ['nuevo', 'contactado', 'cerrado'];

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
        'status',
        'responded_at',
        'closed_at',
    ];

    protected $casts = [
        'services' => 'array',
        'responded_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    /**
     * @return HasMany<ConsultaWhatsappMessage, $this>
     */
    public function whatsappMessages(): HasMany
    {
        return $this->hasMany(ConsultaWhatsappMessage::class);
    }
}
