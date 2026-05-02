<?php

namespace App\Http\Controllers\Vendor;

use App\Data\ProductData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService,
    ) {}

    public function index(): Response
    {
        $vendor = auth()->user()->vendor;
        $paginator = $this->productService->getVendorProducts($vendor);

        $paginator->through(function (Product $product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'quantity' => $product->stock,
                'category' => $product->category?->name,
                'status' => $product->status,
                'created_at' => $product->created_at?->toIso8601String() ?? '',
            ];
        });

        return Inertia::render('vendor/products/index', [
            'products' => $paginator,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('vendor/products/create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'product' => null,
        ]);
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        return Inertia::render('vendor/products/create', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => (string) ($product->description ?? ''),
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'category_id' => $product->category_id,
                'image_path' => $product->image ? Storage::disk('public')->url($product->image) : null,
            ],
        ]);
    }

    public function store(CreateProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $data = ProductData::from([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'category_id' => $validated['category_id'] ?? null,
            'status' => $validated['status'] ?? null,
        ]);

        $this->productService->createProduct(
            auth()->user()->vendor,
            $data,
            $request->file('image')
        );

        return redirect()->route('vendor.products.index')->with('success', 'Produit créé.');
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $validated = $request->validated();
        $data = ProductData::from([
            'name' => $validated['name'] ?? $product->name,
            'description' => array_key_exists('description', $validated)
                ? ($validated['description'] ?? '')
                : (string) ($product->description ?? ''),
            'price' => isset($validated['price']) ? (float) $validated['price'] : (float) $product->price,
            'stock' => isset($validated['stock']) ? (int) $validated['stock'] : (int) $product->stock,
            'category_id' => array_key_exists('category_id', $validated)
                ? $validated['category_id']
                : $product->category_id,
            'status' => $validated['status'] ?? $product->status,
        ]);

        $this->productService->updateProduct(
            $product,
            $data,
            $request->file('image')
        );

        return redirect()->route('vendor.products.index')->with('success', 'Produit mis à jour.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $this->productService->deleteProduct($product);

        return redirect()->route('vendor.products.index')->with('success', 'Produit supprimé.');
    }
}
