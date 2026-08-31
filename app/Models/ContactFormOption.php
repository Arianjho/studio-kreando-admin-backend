<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Una opción de un desplegable del formulario de contacto público.
 * `group` es uno de self::GROUPS; el orden lo da `position`.
 */
class ContactFormOption extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['group', 'label', 'position'];

    protected $casts = ['position' => 'integer'];

    /** Grupos válidos, en el orden en que aparecen en el formulario. */
    public const GROUPS = ['project_type', 'intervention', 'service', 'budget', 'timeline'];

    public function scopeGroup(Builder $query, string $group): Builder
    {
        return $query->where('group', $group);
    }

    /**
     * Etiquetas de cada grupo en orden, cayendo a los valores por defecto del
     * config cuando un grupo no tiene filas en la base de datos.
     *
     * @return array<string, list<string>>
     */
    public static function grouped(): array
    {
        $defaults = config('contact-form.options');
        $rows = static::query()
            ->orderBy('position')
            ->orderBy('id')
            ->get()
            ->groupBy('group');

        $result = [];
        foreach (self::GROUPS as $group) {
            $result[$group] = $rows->has($group)
                ? $rows->get($group)->pluck('label')->all()
                : ($defaults[$group] ?? []);
        }

        return $result;
    }

    /** Inserta los valores por defecto del config que aún no existan. */
    public static function seedDefaults(): void
    {
        foreach (config('contact-form.options') as $group => $labels) {
            foreach (array_values($labels) as $position => $label) {
                static::firstOrCreate(
                    ['group' => $group, 'label' => $label],
                    ['position' => $position],
                );
            }
        }
    }
}
