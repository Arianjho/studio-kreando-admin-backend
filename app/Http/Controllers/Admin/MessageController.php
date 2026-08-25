<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Messages/Index', [
            'messages' => Message::query()->latest()->paginate(15)->withQueryString(),
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
