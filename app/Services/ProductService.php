<?php

namespace App\Services;

use App\Data\ProductData;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function createProduct(Vendor $vendor, ProductData $data, ?UploadedFile $image = null): Product
    {
        $imagePath = null;
        if ($image) {
            $imagePath = $image->store('products', 'public');
        }

        return Product::create([
            'vendor_id' => $vendor->id,
            'name' => $data->name,
            'description' => $data->description,
            'price' => $data->price,
            'stock' => $data->stock,
            'category_id' => $data->category_id,
            'status' => $data->status,
            'image' => $imagePath,
        ]);
    }

    public function updateProduct(Product $product, ProductData $data, ?UploadedFile $image = null): Product
    {
        $updateData = $data->toArray();

        if ($image) {
            // Supprimer l'ancienne image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $updateData['image'] = $image->store('products', 'public');
        }

        $product->update($updateData);

        return $product;
    }

    public function deleteProduct(Product $product): bool
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        return $product->delete();
    }

    public function getVendorProducts(Vendor $vendor)
    {
        return Product::where('vendor_id', $vendor->id)->paginate(20);
    }

    public function decreaseStock(Product $product, int $quantity): bool
    {
        return $product->update([
            'stock' => $product->stock - $quantity,
        ]);
    }

    public function getStockStatus(Product $product): string
    {
        if ($product->stock == 0) {
            return 'OUT_OF_STOCK';
        }
        if ($product->stock < 10) {
            return 'LOW_STOCK';
        }

        return 'IN_STOCK';
    }
}
