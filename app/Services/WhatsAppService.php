<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

/**
 * Envío de texto por WhatsApp vía Evolution API.
 *
 * Endpoint: POST {url}/message/sendText/{instance} con cabecera `apikey`.
 * Cuerpo mínimo: { "number": "51XXXXXXXXX", "text": "..." }.
 */
class WhatsAppService
{
    public function isConfigured(): bool
    {
        $config = config('services.whatsapp');

        return ! empty($config['url']) && ! empty($config['instance']) && ! empty($config['api_key']);
    }

    /**
     * @return array{ok: bool, status: int, body: mixed, number: string}
     */
    public function sendText(string $phone, string $message): array
    {
        $config = config('services.whatsapp');
        $number = $this->toInternational($phone);

        $response = Http::withHeaders(['apikey' => $config['api_key']])
            ->withOptions(['verify' => (bool) $config['verify_ssl']])
            ->acceptJson()
            ->timeout(15)
            ->post(rtrim($config['url'], '/').'/message/sendText/'.$config['instance'], [
                'number' => $number,
                'text' => $message,
            ]);

        return [
            'ok' => $response->successful(),
            'status' => $response->status(),
            'body' => $response->json() ?? $response->body(),
            'number' => $number,
        ];
    }

    /**
     * `987654321` -> `51987654321`. Deja pasar números que ya traen prefijo.
     */
    public function toInternational(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone) ?? '';

        if (strlen($digits) === 9) {
            return '51'.$digits;
        }

        return $digits;
    }
}
