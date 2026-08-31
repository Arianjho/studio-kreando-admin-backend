<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Documentacion OpenAPI (Scramble). En `local` es abierta; en cualquier
        // otro entorno solo la ve un usuario del panel autenticado.
        Gate::define('viewApiDocs', fn (?User $user) => $user !== null);
    }
}
