<?php

use App\Http\Controllers\Admin\AboutContentController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactContentController;
use App\Http\Controllers\Admin\ContactFormOptionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HomeContentController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/admin');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');

    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    Route::get('messages', [MessageController::class, 'index'])->name('messages.index');
    Route::patch('messages/{message}/read', [MessageController::class, 'markRead'])->name('messages.read');
    Route::delete('messages/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');

    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::post('media', [MediaController::class, 'store'])->name('media.store');
    Route::put('media/{medium}', [MediaController::class, 'update'])->name('media.update');
    Route::delete('media/{medium}', [MediaController::class, 'destroy'])->name('media.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::prefix('content')->name('content.')->group(function () {
        Route::get('home', [HomeContentController::class, 'edit'])->name('home');
        Route::put('home', [HomeContentController::class, 'update'])->name('home.update');

        Route::get('about', [AboutContentController::class, 'edit'])->name('about');
        Route::put('about', [AboutContentController::class, 'update'])->name('about.update');

        Route::get('contact', [ContactContentController::class, 'edit'])->name('contact');
        Route::put('contact', [ContactContentController::class, 'update'])->name('contact.update');

        Route::get('form-options', [ContactFormOptionController::class, 'index'])->name('form-options');
        Route::post('form-options', [ContactFormOptionController::class, 'store'])->name('form-options.store');
        Route::put('form-options/{formOption}', [ContactFormOptionController::class, 'update'])->name('form-options.update');
        Route::delete('form-options/{formOption}', [ContactFormOptionController::class, 'destroy'])->name('form-options.destroy');

        Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings');
        Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
