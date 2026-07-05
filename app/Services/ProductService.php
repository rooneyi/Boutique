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

    public function decreaseStock(Product $product, int $quantity, ?int $variantId = null): bool
    {
        $product->load('variants');

        if ($variantId !== null) {
            $variant = $product->variants->firstWhere('id', $variantId);
            if (! $variant || $variant->stock < $quantity) {
                throw new \InvalidArgumentException("Stock insuffisant pour la déclinaison du produit « {$product->name} ».");
            }

            $variant->update(['stock' => max(0, $variant->stock - $quantity)]);
            $this->variantService->refreshProductStockFromVariants($product);

            return true;
        }

        if ($product->variants->isNotEmpty()) {
            $this->decreaseVariantStocksDistributed($product, $quantity);

            return true;
        }

        $ok = $product->update([
            'stock' => max(0, $product->stock - $quantity),
        ]);
        $product->refresh();
        $this->syncProductStockStatus($product);

        return $ok;
    }

    /**
     * Aligne les stocks variantes sur le total produit après des ventes sans variant_id.
     */
    public function reconcileVariantStocksToProduct(Product $product): void
    {
        $product->load('variants');

        if ($product->variants->isEmpty()) {
            return;
        }

        $variantSum = (int) $product->variants->sum('stock');
        $productTotal = (int) $product->stock;

        if ($variantSum <= $productTotal) {
            return;
        }

        $excess = $variantSum - $productTotal;

        foreach ($product->variants->sortByDesc('stock') as $variant) {
            if ($excess <= 0) {
                break;
            }

            $reduce = min($excess, $variant->stock);
            $variant->update(['stock' => $variant->stock - $reduce]);
            $excess -= $reduce;
        }
    }

    private function decreaseVariantStocksDistributed(Product $product, int $quantity): void
    {
        $remaining = $quantity;

        foreach ($product->variants->sortByDesc('stock') as $variant) {
            if ($remaining <= 0) {
                break;
            }

            if ($variant->stock <= 0) {
                continue;
            }

            $take = min($remaining, $variant->stock);
            $variant->update(['stock' => max(0, $variant->stock - $take)]);
            $remaining -= $take;
        }

        if ($remaining > 0) {
            throw new \InvalidArgumentException("Stock insuffisant pour « {$product->name} ».");
        }

        $this->variantService->refreshProductStockFromVariants($product);
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
