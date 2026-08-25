<?php

use App\Http\Controllers\Api\AboutController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SiteSettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API publica (v1)
|--------------------------------------------------------------------------
| Consumida por studio-kreando-website. Lectura de contenido publicada sin
| autenticacion (mismo patron que el backend anterior); el formulario de
| contacto es la unica escritura publica.
*/
Route::prefix('v1')->group(function () {
    Route::get('categories', [CategoryController::class, 'index']);

    Route::get('projects', [ProjectController::class, 'index']);
    Route::get('projects/{project:slug}', [ProjectController::class, 'show']);

    Route::get('home', [HomeController::class, 'show']);
    Route::get('about', [AboutController::class, 'show']);
    Route::get('contact', [ContactController::class, 'show']);
    Route::get('site-settings', [SiteSettingController::class, 'show']);

    Route::post('messages', [MessageController::class, 'store'])->middleware('throttle:10,1');
});
