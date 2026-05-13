<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreProductReviewRequest;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;

class ProductReviewController extends Controller
{
    public function store(StoreProductReviewRequest $request, Product $product): RedirectResponse
    {
        if ($product->status === 'DISCONTINUED') {
            return back()->withErrors(['product' => 'Ce produit n’est plus disponible.']);
        }

        $customer = $request->user()->customer;

        if (! $this->customerHasPurchasedProduct($customer->id, $product->id)) {
            return back()->withErrors([
                'rating' => 'Vous ne pouvez noter que les produits que vous avez déjà commandés.',
            ]);
        }

        $data = $request->validated();

        ProductReview::query()->updateOrCreate(
            [
                'customer_id' => $customer->id,
                'product_id' => $product->id,
            ],
            [
                'rating' => (int) $data['rating'],
                'comment' => isset($data['comment']) ? trim((string) $data['comment']) : null,
            ],
        );

        return back()->with('success', 'Votre avis a été enregistré.');
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
