<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactFormOption;
use App\Services\RevalidateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ContactFormOptionController extends Controller
{
    public function index(): Response
    {
        // Materialise the config defaults the first time the studio opens this
        // page (idempotent), so an already-seeded database still shows them.
        ContactFormOption::seedDefaults();

        return Inertia::render('Admin/Content/FormOptions', [
            'groups' => ContactFormOption::GROUPS,
            'options' => ContactFormOption::query()
                ->orderBy('group')
                ->orderBy('position')
                ->orderBy('id')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'group' => ['required', Rule::in(ContactFormOption::GROUPS)],
            'label' => ['required', 'string', 'max:255'],
        ]);

        ContactFormOption::create([
            'group' => $data['group'],
            'label' => $data['label'],
            'position' => (int) ContactFormOption::group($data['group'])->max('position') + 1,
        ]);

        RevalidateService::trigger('contact');

        return back()->with('success', 'Opción agregada correctamente');
    }

    public function update(Request $request, ContactFormOption $formOption): RedirectResponse
    {
        $data = $request->validate([
            'label' => ['required', 'string', 'max:255'],
        ]);

        $formOption->update($data);

        RevalidateService::trigger('contact');

        return back()->with('success', 'Opción actualizada correctamente');
    }

    public function destroy(ContactFormOption $formOption): RedirectResponse
    {
        $formOption->delete();

        RevalidateService::trigger('contact');

        return back()->with('success', 'Opción eliminada correctamente');
    }
}
