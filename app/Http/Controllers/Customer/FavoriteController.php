<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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
            ->with(['category', 'vendor'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByPivot('created_at', 'desc')
            ->paginate(12);

        $products->through(fn (Product $product) => $this->productPayload($product, true));

        $favoriteIds = $customer->favoriteProducts()->pluck('products.id');

        $suggestedProducts = Product::query()
            ->where('status', '!=', 'DISCONTINUED')
            ->when($favoriteIds->isNotEmpty(), fn ($q) => $q->whereNotIn('id', $favoriteIds))
            ->with(['category', 'vendor'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByDesc('reviews_count')
            ->orderByDesc('reviews_avg_rating')
            ->limit(8)
            ->get()
            ->map(fn (Product $product) => $this->productPayload($product, false))
            ->values()
            ->all();

        return Inertia::render('customer/favorites/index', [
            'products' => $products,
            'suggestedProducts' => $suggestedProducts,
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

    public function preview(): JsonResponse
    {
        $customer = $this->customer();

        $products = $customer->favoriteProducts()
            ->where('products.status', '!=', 'DISCONTINUED')
            ->with(['category', 'vendor'])
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderByPivot('created_at', 'desc')
            ->limit(24)
            ->get()
            ->map(fn (Product $product) => $this->productPayload($product, true))
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

    /**
     * @return array<string, mixed>
     */
    private function productPayload(Product $product, bool $isFavorite): array
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
}
