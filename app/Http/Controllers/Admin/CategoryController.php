<?php

namespace App\Http\Controllers\Admin;

use App\Data\CategoryData;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryService $categoryService
    ) {}

    public function index()
    {
        $categories = $this->categoryService->getAllCategories();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $data = CategoryData::from($request->validate([
            'name' => 'required|string|max:100',
        ]));

        $category = $this->categoryService->createCategory($data->name);
        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        $data = CategoryData::from($request->validate([
            'name' => 'required|string|max:100',
        ]));

        $category = $this->categoryService->updateCategory($category, $data->name);
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $this->categoryService->deleteCategory($category);
        return response()->json(['message' => 'Category deleted']);
    }
}
