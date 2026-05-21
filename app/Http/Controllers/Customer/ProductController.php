<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Services\ProductVariantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $favoriteIdSet = [];
        if (auth()->check() && auth()->user()->role === 'CUSTOMER' && auth()->user()->customer) {
            $favoriteIdSet = auth()->user()->customer->favoriteProducts()->pluck('products.id')->flip()->all();
        }

        $query = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->with(['category', 'vendor'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        $search = $request->string('q')->trim()->toString();

        $categoryFilter = $request->string('category')->toString();
        if ($categoryFilter !== '' && $categoryFilter !== 'all') {
            $query->whereHas('category', fn ($q) => $q->where('name', $categoryFilter));
        }

        if ($search !== '') {
            $term = '%'.addcslashes($search, '%_\\').'%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                    ->orWhere('description', 'like', $term);
            });
        }

        $minPrice = $request->has('min_price') ? (float) $request->input('min_price') : null;
        $maxPrice = $request->has('max_price') ? (float) $request->input('max_price') : null;
        if ($minPrice !== null) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice !== null) {
            $query->where('price', '<=', $maxPrice);
        }

        $sort = $request->string('sort', 'popular')->toString();
        match ($sort) {
            'newest' => $query->orderByDesc('created_at'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->orderByDesc('reviews_count')->orderByDesc('reviews_avg_rating'),
        };

        $products = $query->paginate(6)->withQueryString();

        $products->through(function (Product $product) use ($favoriteIdSet) {
            return $this->productListPayload($product, isset($favoriteIdSet[$product->id]));
        });

        $categories = Category::query()
            ->whereHas(
                'products',
                fn ($q) => $q->where('status', '!=', 'DISCONTINUED'),
            )
            ->withCount([
                'products' => fn ($q) => $q->where('status', '!=', 'DISCONTINUED'),
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $c) => [
                'name' => $c->name,
                'count' => (int) $c->products_count,
            ])
            ->values()
            ->all();

        $totalProducts = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->count();

        return Inertia::render('customer/products/index', [
            'products' => $products,
            'categories' => $categories,
            'totalProducts' => $totalProducts,
            'filters' => [
                'category' => $categoryFilter !== '' ? $categoryFilter : 'all',
                'sort' => $sort,
                'min_price' => (int) ($minPrice ?? 10),
                'max_price' => (int) ($maxPrice ?? 50),
                'q' => $search,
            ],
            'canRegister' => Features::enabled(Features::registration()),
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
            'canRegister' => Features::enabled(Features::registration()),
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
