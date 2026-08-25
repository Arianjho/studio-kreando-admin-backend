<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Avisa a studio-kreando-website que un tag de contenido cambio, para que
 * dispare su propio revalidate (ISR). Espejo de triggerRevalidate del backend anterior.
 */
class RevalidateService
{
    public static function trigger(string $tag): void
    {
        $url = config('services.revalidate.url');
        $secret = config('services.revalidate.secret');

        if (! $url || ! $secret) {
            return;
        }

        try {
            Http::timeout(5)->post($url, [
                'secret' => $secret,
                'tag' => $tag,
            ]);
        } catch (Throwable $e) {
            Log::warning("No se pudo disparar la revalidacion para [{$tag}]: {$e->getMessage()}");
        }
    }
}
