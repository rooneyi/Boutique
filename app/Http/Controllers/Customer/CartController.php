<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\StoreCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private CartService $cartService,
    ) {}

    public function index(): Response
    {
        $this->cartService->reconcile();

        return Inertia::render('customer/cart', [
            'lines' => $this->cartService->lines(),
            'total' => $this->cartService->total(),
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
        $quantity = (int) $request->validated()['quantity'];

        if ($product->status === 'DISCONTINUED') {
            $this->cartService->remove($product->id);

            return back()->withErrors(['quantity' => 'Ce produit n’est plus disponible.']);
        }

        if ($quantity > $product->stock) {
            return back()->withErrors(['quantity' => 'Stock insuffisant pour cette quantité.']);
        }

        $this->cartService->setQuantity($product->id, $quantity);

        return back();
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->cartService->remove($product->id);

        return back();
    }
}
