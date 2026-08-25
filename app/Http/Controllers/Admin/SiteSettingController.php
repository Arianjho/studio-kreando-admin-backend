<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\RevalidateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Content/Settings', [
            'content' => SiteSetting::firstOrFail(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'site_name' => ['required', 'string', 'max:255'],
            'site_url' => ['required', 'string', 'max:255', 'url'],
            'default_seo_description' => ['required', 'string'],
        ]);

        SiteSetting::firstOrFail()->update($data);

        RevalidateService::trigger('site-settings');

        return back()->with('success', 'Ajustes generales actualizados correctamente');
    }
}
