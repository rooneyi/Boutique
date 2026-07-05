<?php

namespace App\Http\Controllers\Admin;

use App\Data\ProductData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\CustomerNotificationService;
use App\Services\ProductService;
use App\Services\ProductVariantService;
use App\Support\BoutiqueStore;
use App\Support\PublicStorage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService,
        private ProductVariantService $variantService,
        private CustomerNotificationService $customerNotifications,
    ) {}

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'product' => null,
            'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43'],
        ]);
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        $product->load('variants');
        $this->productService->reconcileVariantStocksToProduct($product);
        $product->load('variants');

        return Inertia::render('admin/products/form', [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'sizes' => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42', '43'],
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => (string) ($product->description ?? ''),
                'price' => (float) $product->price,
                'category_id' => $product->category_id,
                'status' => $product->status,
                'image_path' => PublicStorage::url($product->image),
                'variants' => $product->variants()
                    ->orderBy('color')
                    ->orderBy('size')
                    ->get()
                    ->map(fn ($v) => $this->variantService->variantPayload($v))
                    ->values()
                    ->all(),
            ],
        ]);
    }

    public function store(CreateProductRequest $request): RedirectResponse
    {
        $this->authorize('create', Product::class);

        $validated = $request->validated();
        $data = ProductData::from([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
            'price' => $validated['price'],
            'stock' => 0,
            'category_id' => $validated['category_id'],
            'status' => $validated['status'] ?? null,
        ]);

        $product = $this->productService->createProduct(
            BoutiqueStore::vendor(),
            $data,
            $request->file('image')
        );

        $this->productService->syncVariants($product, $this->parseVariants($request));

        if ($product->status !== 'DISCONTINUED') {
            $this->customerNotifications->notifyNewProduct($product->fresh());
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit créé.');
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
            'stock' => (int) $product->stock,
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

        if ($request->has('variants')) {
            $this->productService->syncVariants($product->fresh(), $this->parseVariants($request));
        }

        return redirect()->route('admin.products.index')->with('success', 'Produit mis à jour.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $this->productService->deleteProduct($product);

        return redirect()->route('admin.products.index')->with('success', 'Produit supprimé.');
    }

    /**
     * @return list<array{color: string, color_hex?: ?string, size: string, sku?: ?string, stock: int}>
     */
    private function parseVariants(Request $request): array
    {
        $rows = $request->input('variants', []);
        if (! is_array($rows)) {
            return [];
        }

        $parsed = [];
        foreach ($rows as $row) {
            if (! is_array($row) || empty(trim((string) ($row['color'] ?? '')))) {
                continue;
            }
            $parsed[] = [
                'color' => trim((string) $row['color']),
                'color_hex' => ! empty($row['color_hex']) ? (string) $row['color_hex'] : null,
                'size' => strtoupper(trim((string) ($row['size'] ?? 'M'))),
                'sku' => ! empty($row['sku']) ? trim((string) $row['sku']) : null,
                'stock' => (int) ($row['stock'] ?? 0),
            ];
        }

        return $parsed;
    }
}
