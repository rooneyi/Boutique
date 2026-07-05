<?php

namespace App\Support;

use App\Models\Product;
use App\Models\ProductVariant;

class CatalogProduct
{
    public static function defaultVariantId(Product $product): ?int
    {
        if (! $product->relationLoaded('variants')) {
            $product->load(['variants' => fn ($q) => $q->orderBy('id')]);
        }

        if ($product->variants->isEmpty()) {
            return null;
        }

        $inStock = $product->variants->first(fn (ProductVariant $v) => $v->stock > 0);

        return ($inStock ?? $product->variants->first())?->id;
    }

    /**
     * Carte produit vitrine (accueil, favoris, suggestions…).
     *
     * @return array<string, mixed>
     */
    public static function cardPayload(Product $product, bool $isFavorite): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'description' => (string) ($product->description ?? ''),
            'price' => (float) $product->price,
            'quantity' => $product->stock,
            'category' => $product->category?->name ?? '',
            'image_path' => PublicStorage::url($product->image),
            'vendor' => [
                'shop_name' => $product->vendor->shop_name,
            ],
            'rating_avg' => $product->reviews_avg_rating !== null
                ? round((float) $product->reviews_avg_rating, 1)
                : null,
            'reviews_count' => (int) ($product->reviews_count ?? 0),
            'is_favorite' => $isFavorite,
            'default_variant_id' => self::defaultVariantId($product),
        ];
    }

    /**
     * Carte produit allégée (panier, carrousels).
     *
     * @return array<string, mixed>
     */
    public static function compactCardPayload(Product $product, bool $isFavorite): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'image_path' => PublicStorage::url($product->image),
            'rating_avg' => $product->reviews_avg_rating !== null
                ? round((float) $product->reviews_avg_rating, 1)
                : null,
            'reviews_count' => (int) ($product->reviews_count ?? 0),
            'is_favorite' => $isFavorite,
            'default_variant_id' => self::defaultVariantId($product),
        ];
    }
}
