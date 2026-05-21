<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class CartController extends Controller
{
    public function __construct(
        private CartService $cartService,
    ) {}

    public function index(): Response
    {
        $this->cartService->reconcile();

        $favoriteIdSet = [];
        if (auth()->check() && auth()->user()->role === 'CUSTOMER' && auth()->user()->customer) {
            $favoriteIdSet = auth()->user()->customer->favoriteProducts()->pluck('products.id')->flip()->all();
        }

        $lines = array_map(function (array $line) use ($favoriteIdSet) {
            return array_merge($line, [
                'is_favorite' => isset($favoriteIdSet[$line['product_id']]),
            ]);
        }, $this->cartService->lines());

        $subtotal = $this->cartService->total();

        return Inertia::render('customer/cart', [
            'lines' => $lines,
            'subtotal' => $subtotal,
            'shipping' => 0,
            'total' => $subtotal,
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }

    public function preview(): JsonResponse
    {
        $this->cartService->reconcile();

        return response()->json([
            'lines' => $this->cartService->lines(),
            'total' => $this->cartService->total(),
            'count' => $this->cartService->count(),
        ]);
    }

    public function store(StoreCartItemRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $product = Product::query()->findOrFail((int) $data['product_id']);
        $quantity = (int) $data['quantity'];

        if ($product->status === 'DISCONTINUED') {
            return back()->withErrors(['product_id' => 'Ce produit n’est plus disponible.']);
        }

        $already = $this->cartService->quantityForProduct($product->id);
        if ($already + $quantity > $product->stock) {
            return back()->withErrors(['quantity' => 'Stock insuffisant pour cette quantité.']);
        }

        $this->cartService->add($product->id, $quantity);

        return back()->with('success', 'Produit ajouté au panier.');
    }

    public function update(UpdateCartItemRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();
        $quantity = (int) $validated['quantity'];
        $variantId = isset($validated['variant_id']) ? (int) $validated['variant_id'] : null;

        if ($product->status === 'DISCONTINUED') {
            $this->cartService->remove($product->id, $variantId);

            return back()->withErrors(['quantity' => 'Ce produit n’est plus disponible.']);
        }

        $stock = $product->stock;
        if ($variantId) {
            $variant = ProductVariant::query()->find($variantId);
            if (! $variant || $variant->product_id !== $product->id) {
                return back()->withErrors(['quantity' => 'Article invalide.']);
            }
            $stock = $variant->stock;
        }

        if ($quantity > $stock) {
            return back()->withErrors(['quantity' => 'Stock insuffisant pour cette quantité.']);
        }

        $this->cartService->setQuantity($product->id, $quantity, $variantId);

        return back();
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $variantId = $request->filled('variant_id') ? (int) $request->input('variant_id') : null;
        $this->cartService->remove($product->id, $variantId);

        return back();
    }
}
