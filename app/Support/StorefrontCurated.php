<?php

namespace App\Support;

use App\Models\Product;
use Illuminate\Support\Str;

class StorefrontCurated
{
    /**
     * @return list<array{id: int, name: string, description: string, image_path: ?string}>
     */
    public static function products(int $limit = 4, ?int $excludeProductId = null): array
    {
        return Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->when($excludeProductId !== null, fn ($q) => $q->where('id', '!=', $excludeProductId))
            ->withCount('reviews')
            ->orderByDesc('reviews_count')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn (Product $product) => self::payload($product))
            ->values()
            ->all();
    }

    /**
     * @return array{id: int, name: string, description: string, image_path: ?string}
     */
    public static function payload(Product $product): array
    {
        $description = trim((string) ($product->description ?? ''));

        return [
            'id' => $product->id,
            'name' => $product->name,
            'description' => $description !== ''
                ? Str::limit($description, 80)
                : 'Découvrez ce modèle PCJ.',
            'image_path' => PublicStorage::url($product->image),
        ];
    }
}
