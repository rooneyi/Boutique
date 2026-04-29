<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    public function getAllCategories()
    {
        return Category::all();
    }

    public function createCategory(string $name): Category
    {
        return Category::create(['name' => $name]);
    }

    public function updateCategory(Category $category, string $name): Category
    {
        $category->update(['name' => $name]);
        return $category;
    }

    public function deleteCategory(Category $category): bool
    {
        return $category->delete();
    }
}