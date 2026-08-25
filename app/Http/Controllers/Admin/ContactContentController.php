<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactContent;
use App\Services\RevalidateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactContentController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Content/Contact', [
            'content' => ContactContent::firstOrFail(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'address' => ['required', 'string'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'hours' => ['required', 'string'],
        ]);

        ContactContent::firstOrFail()->update($data);

        RevalidateService::trigger('contact');

        return back()->with('success', 'Contenido de contacto actualizado correctamente');
    }
}
