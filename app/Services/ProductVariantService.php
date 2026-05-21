<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductVariantService
{
    /**
     * @param  list<array{color: string, color_hex?: ?string, size: string, sku?: ?string, stock: int, image?: ?UploadedFile}>  $rows
     */
    public function syncVariants(Product $product, array $rows): void
    {
        $product->variants()->delete();

        foreach ($rows as $row) {
            $imagePath = null;
            if (! empty($row['image']) && $row['image'] instanceof UploadedFile) {
                $imagePath = $row['image']->store('products/variants', 'public');
            }

            ProductVariant::create([
                'product_id' => $product->id,
                'color' => $row['color'],
                'color_hex' => $row['color_hex'] ?? null,
                'size' => $row['size'],
                'sku' => $row['sku'] ?? null,
                'stock' => (int) $row['stock'],
                'image' => $imagePath,
            ]);
        }

        $this->refreshProductStockFromVariants($product);
    }

    public function refreshProductStockFromVariants(Product $product): void
    {
        $product->load('variants');
        $totalStock = (int) $product->variants->sum('stock');

        $product->updateQuietly(['stock' => $totalStock]);
        $product->refresh();

        if ($product->status !== 'DISCONTINUED') {
            app(ProductService::class)->syncProductStockStatus($product);
        }
    }

    public function variantPayload(ProductVariant $variant): array
    {
        return [
            'id' => $variant->id,
            'color' => $variant->color,
            'color_hex' => $variant->color_hex,
            'size' => $variant->size,
            'sku' => $variant->sku,
            'stock' => $variant->stock,
            'image_path' => $variant->image
                ? Storage::disk('public')->url($variant->image)
                : null,
        ];
    }
}
