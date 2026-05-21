<?php

namespace App\Services;

use App\Data\ProductData;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    public function __construct(
        private ProductVariantService $variantService,
    ) {}

    public function createProduct(Vendor $vendor, ProductData $data, ?UploadedFile $image = null): Product
    {
        $imagePath = null;
        if ($image) {
            $imagePath = $image->store('products', 'public');
        }

        $status = $data->status === 'DISCONTINUED'
            ? 'DISCONTINUED'
            : $this->stockToStatus($data->stock);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'name' => $data->name,
            'description' => $data->description,
            'price' => $data->price,
            'stock' => 0,
            'category_id' => $data->category_id,
            'status' => $status,
            'image' => $imagePath,
        ]);

        return $product->fresh();
    }

    /**
     * @param  list<array{color: string, color_hex?: ?string, size: string, sku?: ?string, stock: int}>  $variantRows
     */
    public function syncVariants(Product $product, array $variantRows): Product
    {
        $this->variantService->syncVariants($product, $variantRows);

        return $product->fresh(['variants']);
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

        unset($updateData['stock']);
        $product->update($updateData);
        $product->refresh();

        if ($product->variants()->exists()) {
            $this->variantService->refreshProductStockFromVariants($product);
        } else {
            $this->syncProductStockStatus($product);
        }

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
        $ok = $product->update([
            'stock' => max(0, $product->stock - $quantity),
        ]);
        $product->refresh();
        $this->syncProductStockStatus($product);

        return $ok;
    }

    public function getStockStatus(Product $product): string
    {
        return $this->stockToStatus($product->stock);
    }

    public function syncProductStockStatus(Product $product): void
    {
        if ($product->status === 'DISCONTINUED') {
            return;
        }

        $product->updateQuietly([
            'status' => $this->stockToStatus($product->stock),
        ]);
    }

    private function stockToStatus(int $stock): string
    {
        if ($stock <= 0) {
            return 'OUT_OF_STOCK';
        }
        if ($stock < 10) {
            return 'LOW_STOCK';
        }

        return 'IN_STOCK';
    }
}
