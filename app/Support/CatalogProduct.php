<?php

namespace App\Support;

use App\Models\Product;
use App\Models\ProductVariant;

class CatalogProduct
{
    /**
     * Carte produit vitrine (accueil, favoris, suggestions…).
     *
     * @return array<string, mixed>
     */
    public static function cardPayload(Product $product, bool $isFavorite, ?string $preferredColor = null): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'description' => (string) ($product->description ?? ''),
            'price' => (float) $product->price,
            'quantity' => $product->stock,
            'category' => $product->category?->name ?? '',
            'image_path' => PublicStorage::url(self::resolvedCardImage($product, $preferredColor)),
            'vendor' => [
                'shop_name' => $product->vendor->shop_name,
            ],
            'rating_avg' => $product->reviews_avg_rating !== null
                ? round((float) $product->reviews_avg_rating, 1)
                : null,
            'reviews_count' => (int) ($product->reviews_count ?? 0),
            'is_favorite' => $isFavorite,
            'default_variant_id' => self::defaultVariantId($product, $preferredColor),
        ];
    }

    /**
     * Carte produit allégée (panier, carrousels).
     *
     * @return array<string, mixed>
     */
    public static function compactCardPayload(Product $product, bool $isFavorite, ?string $preferredColor = null): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'price' => (float) $product->price,
            'image_path' => PublicStorage::url(self::resolvedCardImage($product, $preferredColor)),
            'rating_avg' => $product->reviews_avg_rating !== null
                ? round((float) $product->reviews_avg_rating, 1)
                : null,
            'reviews_count' => (int) ($product->reviews_count ?? 0),
            'is_favorite' => $isFavorite,
            'default_variant_id' => self::defaultVariantId($product, $preferredColor),
        ];
    }

    public static function defaultVariantId(Product $product, ?string $preferredColor = null): ?int
    {
        if (! $product->relationLoaded('variants')) {
            $product->load(['variants' => fn ($q) => $q->orderBy('id')]);
        }

        if ($product->variants->isEmpty()) {
            return null;
        }

        if ($preferredColor !== null && $preferredColor !== '') {
            $forColor = $product->variants->first(
                fn (ProductVariant $v) => strcasecmp($v->color, $preferredColor) === 0 && $v->stock > 0,
            ) ?? $product->variants->first(
                fn (ProductVariant $v) => strcasecmp($v->color, $preferredColor) === 0,
            );

            if ($forColor !== null) {
                return $forColor->id;
            }
        }

        $inStock = $product->variants->first(fn (ProductVariant $v) => $v->stock > 0);

        return ($inStock ?? $product->variants->first())?->id;
    }

    private static function resolvedCardImage(Product $product, ?string $preferredColor): ?string
    {
        if ($preferredColor !== null && $preferredColor !== '' && $product->relationLoaded('variants')) {
            $match = $product->variants->first(
                fn (ProductVariant $v) => strcasecmp($v->color, $preferredColor) === 0 && filled($v->image),
            );

            if ($match !== null) {
                return $match->image;
            }
        }

        return $product->image;
    }
}
