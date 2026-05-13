<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $favoriteIdSet = [];
        if (auth()->check() && auth()->user()->role === 'CUSTOMER' && auth()->user()->customer) {
            $favoriteIdSet = auth()->user()->customer->favoriteProducts()->pluck('products.id')->flip()->all();
        }

        $products = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->with(['category', 'vendor'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByDesc('created_at')
            ->paginate(12);

        $products->through(function (Product $product) use ($favoriteIdSet) {
            return $this->productListPayload($product, isset($favoriteIdSet[$product->id]));
        });

        return Inertia::render('customer/products/index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product): Response
    {
        if ($product->status === 'DISCONTINUED') {
            abort(404);
        }

        $category = $product->category;
        $customer = auth()->user()?->customer;

        $ratingAvg = $product->reviews()->avg('rating');
        $ratingAvg = $ratingAvg !== null ? round((float) $ratingAvg, 1) : null;
        $reviewsCount = $product->reviews()->count();

        $favorited = $customer !== null
            && $customer->favoriteProducts()->whereKey($product->id)->exists();

        $reviews = $product->reviews()
            ->with('customer.user')
            ->latest()
            ->limit(40)
            ->get()
            ->map(static function (ProductReview $r) {
                return [
                    'id' => $r->id,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'created_at' => $r->created_at?->toIso8601String() ?? '',
                    'author' => $r->customer->user?->name ?? 'Client',
                ];
            })
            ->values()
            ->all();

        $userReview = null;
        if ($customer !== null) {
            $ur = $product->reviews()->where('customer_id', $customer->id)->first();
            if ($ur !== null) {
                $userReview = [
                    'rating' => $ur->rating,
                    'comment' => $ur->comment,
                    'updated_at' => $ur->updated_at?->toIso8601String() ?? '',
                ];
            }
        }

        $canReview = $customer !== null && $this->customerHasPurchasedProduct($customer->id, $product->id);

        return Inertia::render('customer/products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => (string) ($product->description ?? ''),
                'price' => (float) $product->price,
                'stock' => $product->stock,
                'category' => $category?->name ?? '',
                'image_path' => $product->image
                    ? Storage::disk('public')->url($product->image)
                    : null,
                'vendor' => [
                    'id' => $product->vendor->id,
                    'shop_name' => $product->vendor->shop_name,
                ],
                'rating_avg' => $ratingAvg,
                'reviews_count' => $reviewsCount,
                'is_favorite' => $favorited,
            ],
            'category_name' => $category?->name,
            'reviews' => $reviews,
            'user_review' => $userReview,
            'can_review' => $canReview,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function productListPayload(Product $product, bool $isFavorite): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'description' => (string) ($product->description ?? ''),
            'price' => (float) $product->price,
            'quantity' => $product->stock,
            'category' => $product->category?->name ?? '',
            'image_path' => $product->image
                ? Storage::disk('public')->url($product->image)
                : null,
            'vendor' => [
                'shop_name' => $product->vendor->shop_name,
            ],
            'rating_avg' => $product->reviews_avg_rating !== null ? round((float) $product->reviews_avg_rating, 1) : null,
            'reviews_count' => (int) ($product->reviews_count ?? 0),
            'is_favorite' => $isFavorite,
        ];
    }

    private function customerHasPurchasedProduct(int $customerId, int $productId): bool
    {
        return OrderItem::query()
            ->where('product_id', $productId)
            ->whereHas('order', function ($q) use ($customerId) {
                $q->where('customer_id', $customerId)
                    ->whereIn('status', ['PAID', 'PENDING']);
            })
            ->exists();
    }
}
