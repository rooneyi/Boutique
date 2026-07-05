<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Support\PublicStorage;
use Illuminate\Support\Facades\Session;

class CartService
{
    private const SESSION_KEY = 'cart.items';

    /** @return list<array{product_id: int, variant_id: ?int, quantity: int}> */
    public function items(): array
    {
        $raw = Session::get(self::SESSION_KEY, []);

        return array_values(array_map(static function (array $row): array {
            return [
                'product_id' => (int) $row['product_id'],
                'variant_id' => isset($row['variant_id']) ? (int) $row['variant_id'] : null,
                'quantity' => (int) $row['quantity'],
            ];
        }, $raw));
    }

    public function count(): int
    {
        return (int) array_sum(array_column($this->items(), 'quantity'));
    }

    public function add(int $productId, int $quantity, ?int $variantId = null): void
    {
        $items = $this->items();
        $found = false;
        foreach ($items as &$item) {
            if ($item['product_id'] === $productId && $item['variant_id'] === $variantId) {
                $item['quantity'] += $quantity;
                $found = true;
                break;
            }
        }
        unset($item);
        if (! $found) {
            $items[] = [
                'product_id' => $productId,
                'variant_id' => $variantId,
                'quantity' => $quantity,
            ];
        }
        Session::put(self::SESSION_KEY, $items);
    }

    public function remove(int $productId, ?int $variantId = null): void
    {
        $items = array_values(array_filter(
            $this->items(),
            fn (array $i): bool => ! ($i['product_id'] === $productId && $i['variant_id'] === $variantId)
        ));
        Session::put(self::SESSION_KEY, $items);
    }

    public function clear(): void
    {
        Session::forget(self::SESSION_KEY);
    }

    public function setQuantity(int $productId, int $quantity, ?int $variantId = null): void
    {
        if ($quantity <= 0) {
            $this->remove($productId, $variantId);

            return;
        }

        $items = $this->items();
        $found = false;
        foreach ($items as &$item) {
            if ($item['product_id'] === $productId && $item['variant_id'] === $variantId) {
                $item['quantity'] = $quantity;
                $found = true;
                break;
            }
        }
        unset($item);

        if (! $found) {
            $items[] = [
                'product_id' => $productId,
                'variant_id' => $variantId,
                'quantity' => $quantity,
            ];
        }

        Session::put(self::SESSION_KEY, $items);
    }

    /**
     * @return list<array{
     *   product_id: int,
     *   variant_id: ?int,
     *   quantity: int,
     *   name: string,
     *   price: float,
     *   line_total: float,
     *   image_path: ?string,
     *   vendor_shop: string,
     *   vendor_id: int,
     *   stock: int,
     *   color: ?string,
     *   size: ?string,
     *   sku: ?string
     * }>
     */
    public function lines(): array
    {
        $items = $this->items();
        if ($items === []) {
            return [];
        }

        $productIds = array_unique(array_column($items, 'product_id'));
        $products = Product::query()
            ->whereIn('id', $productIds)
            ->with('vendor')
            ->get()
            ->keyBy('id');

        $variantIds = array_filter(array_column($items, 'variant_id'));
        $variants = $variantIds !== []
            ? ProductVariant::query()->whereIn('id', $variantIds)->get()->keyBy('id')
            : collect();

        $lines = [];
        foreach ($items as $row) {
            $product = $products->get($row['product_id']);
            if (! $product || $product->status === 'DISCONTINUED') {
                continue;
            }

            $variant = $row['variant_id'] ? $variants->get($row['variant_id']) : null;
            $stock = $variant ? $variant->stock : $product->stock;
            $qty = (int) $row['quantity'];
            $price = (float) $product->price;

            $imagePath = PublicStorage::url($variant?->image ?? $product->image);

            $name = $product->name;
            if ($variant) {
                $name .= ' — '.$variant->color.' / '.$variant->size;
            }

            $lines[] = [
                'product_id' => $product->id,
                'variant_id' => $row['variant_id'],
                'quantity' => $qty,
                'name' => $name,
                'price' => $price,
                'line_total' => $price * $qty,
                'image_path' => $imagePath,
                'vendor_shop' => $product->vendor->shop_name,
                'vendor_id' => $product->vendor_id,
                'stock' => $stock,
                'color' => $variant?->color,
                'size' => $variant?->size,
                'sku' => $variant?->sku,
            ];
        }

        return $lines;
    }

    public function total(): float
    {
        return array_sum(array_column($this->lines(), 'line_total'));
    }

    public function reconcile(): void
    {
        $items = $this->items();
        if ($items === []) {
            return;
        }

        $next = [];
        foreach ($items as $row) {
            $product = Product::query()->find($row['product_id']);
            if (! $product || $product->status === 'DISCONTINUED') {
                continue;
            }

            $stock = $product->stock;
            if ($row['variant_id']) {
                $variant = ProductVariant::query()->find($row['variant_id']);
                if (! $variant || $variant->product_id !== $product->id) {
                    continue;
                }
                $stock = $variant->stock;
            }

            $qty = min((int) $row['quantity'], max(0, $stock));
            if ($qty > 0) {
                $next[] = [
                    'product_id' => $product->id,
                    'variant_id' => $row['variant_id'],
                    'quantity' => $qty,
                ];
            }
        }
        Session::put(self::SESSION_KEY, $next);
    }

    public function quantityForLine(int $productId, ?int $variantId = null): int
    {
        foreach ($this->items() as $row) {
            if ($row['product_id'] === $productId && $row['variant_id'] === $variantId) {
                return (int) $row['quantity'];
            }
        }

        return 0;
    }

    /** @deprecated */
    public function quantityForProduct(int $productId): int
    {
        return $this->quantityForLine($productId, null);
    }
}
