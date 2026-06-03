<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\ProductVariant;
use App\Services\ProductVariantService;
use App\Support\CatalogProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class ProductController extends Controller
{
    public function __construct(
        private ProductVariantService $variantService,
    ) {}

    public function index(Request $request): Response
    {
        $favoriteIdSet = [];
        if (auth()->check() && auth()->user()->role === 'CUSTOMER' && auth()->user()->customer) {
            $favoriteIdSet = auth()->user()->customer->favoriteProducts()->pluck('products.id')->flip()->all();
        }

        $query = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->with(['category', 'vendor', 'variants' => fn ($q) => $q->orderBy('id')])
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

        $colorFilter = $request->string('color')->trim()->toString();
        if ($colorFilter !== '') {
            $query->whereHas('variants', fn ($q) => $q->where('color', $colorFilter));
        }

        $priceFilterActive = $request->filled('min_price') || $request->filled('max_price');
        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        $sort = $request->string('sort', 'popular')->toString();
        if (! in_array($sort, ['popular', 'newest', 'price_asc', 'price_desc'], true)) {
            $sort = 'popular';
        }

        match ($sort) {
            'newest' => $query->orderByDesc('created_at'),
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'popular' => $query
                ->withSum(
                    ['orderItems as units_sold' => fn ($q) => $q->whereHas(
                        'order',
                        fn ($o) => $o->whereIn('status', ['PAID', 'PENDING']),
                    )],
                    'quantity',
                )
                ->orderByDesc('units_sold')
                ->orderByDesc('reviews_count')
                ->orderByDesc('reviews_avg_rating')
                ->orderByDesc('created_at'),
        };

        $products = $query->paginate(6)->withQueryString();

        $products->through(fn (Product $product) => CatalogProduct::cardPayload(
            $product,
            isset($favoriteIdSet[$product->id]),
        ));

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

        $priceBounds = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->selectRaw('COALESCE(MIN(price), 0) as min_bound, COALESCE(MAX(price), 200) as max_bound')
            ->first();

        $catalogMinPrice = (int) floor((float) ($priceBounds->min_bound ?? 0));
        $catalogMaxPrice = (int) ceil((float) ($priceBounds->max_bound ?? 200));

        $colorOptions = ProductVariant::query()
            ->join('products', 'product_variants.product_id', '=', 'products.id')
            ->where('products.status', '!=', 'DISCONTINUED')
            ->whereNotNull('product_variants.color')
            ->where('product_variants.color', '!=', '')
            ->selectRaw('product_variants.color as name, MAX(product_variants.color_hex) as hex, COUNT(DISTINCT products.id) as count')
            ->groupBy('product_variants.color')
            ->orderBy('product_variants.color')
            ->get()
            ->map(fn ($row) => [
                'name' => (string) $row->name,
                'hex' => (string) ($row->hex ?: '#000000'),
                'count' => (int) $row->count,
            ])
            ->values()
            ->all();

        return Inertia::render('customer/products/index', [
            'products' => $products,
            'categories' => $categories,
            'colorOptions' => $colorOptions,
            'totalProducts' => $totalProducts,
            'filters' => [
                'category' => $categoryFilter !== '' ? $categoryFilter : 'all',
                'sort' => $sort,
                'min_price' => $request->filled('min_price')
                    ? (int) $request->input('min_price')
                    : $catalogMinPrice,
                'max_price' => $request->filled('max_price')
                    ? (int) $request->input('max_price')
                    : $catalogMaxPrice,
                'price_filter_active' => $priceFilterActive,
                'catalog_min_price' => $catalogMinPrice,
                'catalog_max_price' => $catalogMaxPrice,
                'q' => $search,
                'color' => $colorFilter,
            ],
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

    public function show(Product $product): Response
    {
        if ($product->status === 'DISCONTINUED') {
            abort(404);
        }

        $product->load(['category', 'vendor', 'variants']);

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
                'variants' => $product->variants
                    ->map(fn ($v) => $this->variantService->variantPayload($v))
                    ->values()
                    ->all(),
            ],
            'category_name' => $category?->name,
            'reviews' => $reviews,
            'user_review' => $userReview,
            'can_review' => $canReview,
        ]);
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
