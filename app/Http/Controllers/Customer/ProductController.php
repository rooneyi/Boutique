<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('status', 'active')
            ->with('category', 'vendor')
            ->paginate(12);

        return Inertia::render('customer/products/index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        $category = $product->category;

        return Inertia::render('customer/products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'original_price' => $product->original_price,
                'stock' => $product->stock,
                'category' => $product->category?->name,
                'image_path' => $product->image_path,
                'rating' => 4.3,
                'reviews_count' => 210,
                'colors' => ['black', 'green', 'orange', 'blue'],
                'sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'vendor' => [
                    'id' => $product->vendor->id,
                    'shop_name' => $product->vendor->shop_name,
                ],
            ],
            'category_name' => $category?->name,
        ]);
    }
}
