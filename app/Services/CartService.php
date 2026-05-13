<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

class CartService
{
    private const SESSION_KEY = 'cart.items';

    /** @return list<array{product_id: int, quantity: int}> */
    public function items(): array
    {
        return Session::get(self::SESSION_KEY, []);
    }

    public function count(): int
    {
        return (int) array_sum(array_column($this->items(), 'quantity'));
    }

    public function add(int $productId, int $quantity): void
    {
        $items = $this->items();
        $found = false;
        foreach ($items as &$item) {
            if ($item['product_id'] === $productId) {
                $item['quantity'] += $quantity;
                $found = true;
                break;
            }
        }
        unset($item);
        if (! $found) {
            $items[] = ['product_id' => $productId, 'quantity' => $quantity];
        }
        Session::put(self::SESSION_KEY, $items);
    }

    public function remove(int $productId): void
    {
        $items = array_values(array_filter(
            $this->items(),
            fn (array $i): bool => $i['product_id'] !== $productId
        ));
        Session::put(self::SESSION_KEY, $items);
    }

    /**
     * @return list<array{
     *   product_id: int,
     *   quantity: int,
     *   name: string,
     *   price: float,
     *   line_total: float,
     *   image_path: ?string,
     *   vendor_shop: string,
     *   stock: int
     * }>
     */
    public function lines(): array
    {
        $items = $this->items();
        if ($items === []) {
            return [];
        }

        $ids = array_column($items, 'product_id');
        $products = Product::query()
            ->whereIn('id', $ids)
            ->with('vendor')
            ->get()
            ->keyBy('id');

        $lines = [];
        foreach ($items as $row) {
            $product = $products->get($row['product_id']);
            if (! $product || $product->status === 'DISCONTINUED') {
                continue;
            }
            $qty = (int) $row['quantity'];
            $price = (float) $product->price;
            $lines[] = [
                'product_id' => $product->id,
                'quantity' => $qty,
                'name' => $product->name,
                'price' => $price,
                'line_total' => $price * $qty,
                'image_path' => $product->image
                    ? Storage::disk('public')->url($product->image)
                    : null,
                'vendor_shop' => $product->vendor->shop_name,
                'stock' => $product->stock,
            ];
        }

        return $lines;
    }

    public function total(): float
    {
        return array_sum(array_column($this->lines(), 'line_total'));
    }

    /** Drop cart lines whose product is unavailable or trim qty to stock. */
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
            $qty = min((int) $row['quantity'], max(0, $product->stock));
            if ($qty > 0) {
                $next[] = ['product_id' => $product->id, 'quantity' => $qty];
            }
        }
        Session::put(self::SESSION_KEY, $next);
    }

    public function quantityForProduct(int $productId): int
    {
        foreach ($this->items() as $row) {
            if ($row['product_id'] === $productId) {
                return (int) $row['quantity'];
            }
        }

        return 0;
    }
}
