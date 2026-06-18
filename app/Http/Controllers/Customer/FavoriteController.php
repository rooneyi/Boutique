<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\CatalogProduct;
use App\Support\StorefrontCurated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class FavoriteController extends Controller
{
    private function customer()
    {
        $customer = auth()->user()?->customer;

        if ($customer === null) {
            abort(403, 'Profil client introuvable.');
        }

        return $customer;
    }

    public function index(): Response
    {
        $customer = $this->customer();

        $products = $customer->favoriteProducts()
            ->where('products.status', '!=', 'DISCONTINUED')
            ->with(['category', 'vendor', 'variants' => fn ($q) => $q->orderBy('id')])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByPivot('created_at', 'desc')
            ->paginate(12);

        $products->through(fn (Product $product) => CatalogProduct::cardPayload($product, true));

        $favoriteIds = $customer->favoriteProducts()->pluck('products.id');

        $suggestedProducts = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->when($favoriteIds->isNotEmpty(), fn ($q) => $q->whereNotIn('id', $favoriteIds))
            ->with(['category', 'vendor', 'variants' => fn ($q) => $q->orderBy('id')])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByDesc('reviews_count')
            ->orderByDesc('reviews_avg_rating')
            ->limit(8)
            ->get()
            ->map(fn (Product $product) => CatalogProduct::cardPayload($product, false))
            ->values()
            ->all();

        return Inertia::render('customer/favorites/index', [
            'products' => $products,
            'suggestedProducts' => $suggestedProducts,
            'canRegister' => Features::enabled(Features::registration()),
            'curatedProducts' => StorefrontCurated::products(4),
        ]);
    }

    public function preview(): JsonResponse
    {
        $customer = $this->customer();

        $products = $customer->favoriteProducts()
            ->where('products.status', '!=', 'DISCONTINUED')
            ->with(['category', 'vendor', 'variants' => fn ($q) => $q->orderBy('id')])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByPivot('created_at', 'desc')
            ->limit(24)
            ->get()
            ->map(fn (Product $product) => CatalogProduct::cardPayload($product, true))
            ->values();

        return response()->json([
            'products' => $products,
            'count' => (int) $customer->favoriteProducts()
                ->where('products.status', '!=', 'DISCONTINUED')
                ->count(),
        ]);
    }

    public function store(Product $product): RedirectResponse
    {
        if ($product->status === 'DISCONTINUED') {
            return back()->withErrors(['product' => 'Ce produit n’est plus disponible.']);
        }

        $customer = auth()->user()->customer;
        $customer->favoriteProducts()->syncWithoutDetaching([$product->id]);

        return back()->with('success', 'Ajouté aux favoris.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->customer()->favoriteProducts()->detach($product->id);

        return back();
    }
}
