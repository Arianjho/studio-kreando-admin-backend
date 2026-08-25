<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\RevalidateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::withCount('projects')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create($data);

        RevalidateService::trigger('categories');

        return back()->with('success', 'Categoría creada correctamente');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$category->id,
        ]);

        $category->update($data);

        RevalidateService::trigger('categories');

        return back()->with('success', 'Categoría actualizada correctamente');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        RevalidateService::trigger('categories');

        return back()->with('success', 'Categoría eliminada correctamente');
    }
}
