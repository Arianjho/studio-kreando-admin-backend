<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactFormOption;
use App\Models\Message;
use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', '')) ?: null;
        $projectType = trim((string) $request->query('project_type', '')) ?: null;
        $status = in_array($request->query('status'), ['new', 'read'], true)
            ? $request->query('status')
            : null;

        $messages = Message::query()
            ->when($search, function (Builder $query, string $term): void {
                $like = '%'.mb_strtolower($term).'%';
                $query->where(function (Builder $inner) use ($like): void {
                    $inner->whereRaw('lower(name) like ?', [$like])
                        ->orWhereRaw('lower(email) like ?', [$like])
                        ->orWhereRaw('lower(message) like ?', [$like]);
                });
            })
            ->when($projectType, fn (Builder $query, string $type) => $query->where('project_type', $type))
            ->when($status === 'new', fn (Builder $query) => $query->where('read', false))
            ->when($status === 'read', fn (Builder $query) => $query->where('read', true))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'filters' => [
                'search' => $search,
                'project_type' => $projectType,
                'status' => $status,
            ],
            'projectTypes' => ContactFormOption::grouped()['project_type'],
        ]);
    }

    public function markRead(Message $message): RedirectResponse
    {
        $message->update(['read' => true]);

        return back()->with('success', 'Mensaje marcado como leído');
    }

    public function destroy(Message $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', 'Mensaje eliminado correctamente');
    }
}
