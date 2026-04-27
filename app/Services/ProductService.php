<?php

namespace App\Services;

use App\Data\ProductData;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ProductService
{
    public function createProduct(User $vendor, ProductData $data, ?UploadedFile $image = null): Product
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
            'quantity' => $data->quantity,
            'category' => $data->category,
            'image_path' => $imagePath,
        ]);
    }

    public function updateProduct(Product $product, ProductData $data, ?UploadedFile $image = null): Product
    {
        $updateData = $data->toArray();

        if ($image) {
            // Supprimer l'ancienne image
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }
            $updateData['image_path'] = $image->store('products', 'public');
        }

        $product->update($updateData);
        return $product;
    }

    public function deleteProduct(Product $product): bool
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }
        return $product->delete();
    }

    public function getVendorProducts(User $vendor)
    {
        return Product::where('vendor_id', $vendor->id)->paginate(20);
    }

    public function decreaseStock(Product $product, int $quantity): bool
    {
        return $product->update([
            'quantity' => $product->quantity - $quantity,
        ]);
    }

    public function getStockStatus(Product $product): string
    {
        if ($product->quantity == 0) {
            return 'out_of_stock';
        }
        if ($product->quantity < 10) {
            return 'low_stock';
        }
        return 'in_stock';
    }
}
