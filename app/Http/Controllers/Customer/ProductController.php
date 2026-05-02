<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->with(['category', 'vendor'])
            ->orderByDesc('created_at')
            ->paginate(12);

        $products->through(function (Product $product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => (string) ($product->description ?? ''),
                'price' => (float) $product->price,
                'quantity' => $product->stock,
                'category' => $product->category?->name ?? '',
                'image_path' => $product->image
                    ? Storage::disk('public')->url($product->image)
                    : null,
                'vendor' => [
                    'shop_name' => $product->vendor->shop_name,
                ],
            ];
        });

        return Inertia::render('customer/products/index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product): Response
    {
        if ($product->status === 'DISCONTINUED') {
            abort(404);
        }

        $category = $product->category;

        return Inertia::render('customer/products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => (string) ($product->description ?? ''),
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'category' => $category?->name ?? '',
                'image_path' => $product->image
                    ? Storage::disk('public')->url($product->image)
                    : null,
                'vendor' => [
                    'id' => $product->vendor->id,
                    'shop_name' => $product->vendor->shop_name,
                ],
            ],
            'category_name' => $category?->name,
        ]);
    }
}
