<?php

namespace App\Models;

use Database\Factories\ConsultaWhatsappMessageFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultaWhatsappMessage extends Model
{
    /** @use HasFactory<ConsultaWhatsappMessageFactory> */
    use HasFactory;

    protected $fillable = [
        'consulta_id',
        'user_id',
        'to_number',
        'body',
        'status',
        'provider_response',
    ];

    /**
     * @return BelongsTo<Consulta, $this>
     */
    public function consulta(): BelongsTo
    {
        return $this->belongsTo(Consulta::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
