<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Consulta;
use App\Models\ContactFormOption;
use App\Models\SiteSetting;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConsultaController extends Controller
{
    public function index(Request $request, WhatsAppService $whatsapp): Response
    {
        $search = trim((string) $request->query('search', '')) ?: null;
        $projectType = trim((string) $request->query('project_type', '')) ?: null;
        $status = in_array($request->query('status'), ['new', 'read', 'responded'], true)
            ? $request->query('status')
            : null;

        $consultas = Consulta::query()
            ->when($search, function (Builder $query, string $term): void {
                $like = '%'.mb_strtolower($term).'%';
                $query->where(function (Builder $inner) use ($like): void {
                    $inner->whereRaw('lower(name) like ?', [$like])
                        ->orWhereRaw('lower(phone) like ?', [$like])
                        ->orWhereRaw('lower(message) like ?', [$like]);
                });
            })
            ->when($projectType, fn (Builder $query, string $type) => $query->where('project_type', $type))
            ->when($status === 'new', fn (Builder $query) => $query->where('read', false))
            ->when($status === 'read', fn (Builder $query) => $query->where('read', true)->whereNull('responded_at'))
            ->when($status === 'responded', fn (Builder $query) => $query->whereNotNull('responded_at'))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Consultas/Index', [
            'consultas' => $consultas,
            'filters' => [
                'search' => $search,
                'project_type' => $projectType,
                'status' => $status,
            ],
            'projectTypes' => ContactFormOption::grouped()['project_type'],
            'whatsappEnabled' => $whatsapp->isConfigured(),
            'whatsappTemplate' => SiteSetting::query()->value('whatsapp_message_template') ?? '',
        ]);
    }

    public function markRead(Consulta $consulta): RedirectResponse
    {
        $consulta->update(['read' => true]);

        return back()->with('success', 'Consulta marcada como leída');
    }

    public function sendWhatsApp(Request $request, Consulta $consulta, WhatsAppService $whatsapp): RedirectResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:4000'],
        ]);

        if (! $whatsapp->isConfigured()) {
            return back()->with('error', 'WhatsApp no está configurado en el servidor.');
        }

        if (! preg_match('/^\d{9}$/', (string) $consulta->phone)) {
            return back()->with('error', 'La consulta no tiene un número de teléfono válido.');
        }

        $result = $whatsapp->sendText($consulta->phone, $data['message']);

        $consulta->whatsappMessages()->create([
            'user_id' => $request->user()?->id,
            'to_number' => $result['number'],
            'body' => $data['message'],
            'status' => $result['ok'] ? 'sent' : 'failed',
            'provider_response' => is_string($result['body']) ? $result['body'] : json_encode($result['body']),
        ]);

        if (! $result['ok']) {
            return back()->with('error', 'No se pudo enviar el WhatsApp. Revisa la conexión de la instancia.');
        }

        $consulta->update(['read' => true, 'responded_at' => now()]);

        return back()->with('success', 'WhatsApp enviado a '.$consulta->name);
    }

    public function destroy(Consulta $consulta): RedirectResponse
    {
        $consulta->delete();

        return back()->with('success', 'Consulta eliminada correctamente');
    }
}
