<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\CreateProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Services\ProductService;
use App\Data\ProductData;
use App\Models\Product;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService,
    ) {}

    public function index()
    {
        $products = $this->productService->getVendorProducts(auth()->user()->vendor);

        return response()->json([
            'data' => $products,
        ]);
    }

    public function store(CreateProductRequest $request)
    {
        $data = ProductData::from($request->validated());
        $product = $this->productService->createProduct(
            auth()->user()->vendor,
            $data,
            $request->file('image')
        );

        return response()->json([
            'message' => 'Produit créé avec succès',
            'data' => $product,
        ], 201);
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);

        return response()->json([
            'data' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $data = ProductData::from($request->validated());
        $product = $this->productService->updateProduct(
            $product,
            $data,
            $request->file('image')
        );

        return response()->json([
            'message' => 'Produit mis à jour avec succès',
            'data' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $this->productService->deleteProduct($product);

        return response()->json([
            'message' => 'Produit supprimé avec succès',
        ]);
    }

    public function getStockStatus(Product $product)
    {
        $this->authorize('view', $product);

        $status = $this->productService->getStockStatus($product);

        return response()->json([
            'status' => $status,
        ]);
    }
}
