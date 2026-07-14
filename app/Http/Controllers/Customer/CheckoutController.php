<?php

namespace App\Http\Controllers\Customer;

use App\Data\OrderData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreCheckoutRequest;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartService;
use App\Services\OrderService;
use App\Support\PhoneNumber;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class CheckoutController extends Controller
{
    public function __construct(
        private CartService $cartService,
        private OrderService $orderService,
    ) {}

    public function create(): Response|RedirectResponse
    {
        $this->cartService->reconcile();
        $lines = $this->cartService->lines();

        if ($lines === []) {
            return redirect()->route('customer.cart')->with('error', 'Votre panier est vide.');
        }

        $user = auth()->user();
        $user?->loadMissing('customer');
        $subtotal = $this->cartService->total();

        return Inertia::render('customer/checkout', [
            'lines' => $lines,
            'subtotal' => $subtotal,
            'shipping' => 0,
            'total' => $subtotal,
            'canRegister' => Features::enabled(Features::registration()),
            'defaults' => [
                'delivery_method' => 'home_delivery',
                'shipping_full_name' => $user->name ?? '',
                'shipping_whatsapp' => $user?->customer?->phone ?? '',
                'shipping_address' => '',
                'shipping_city' => '',
                'shipping_district' => '',
                'payment_method' => 'mobile_money',
                'payment_provider' => 'airtel',
                'payment_phone' => $user?->customer?->phone ?? '',
                'customer_note' => '',
            ],
            'whatsappPhone' => '243991934590',
        ]);
    }

    public function store(StoreCheckoutRequest $request): RedirectResponse
    {
        $this->cartService->reconcile();
        $lines = $this->cartService->lines();

        if ($lines === []) {
            return redirect()->route('customer.cart')->with('error', 'Votre panier est vide.');
        }

        $customer = auth()->user()->customer;
        $validated = $request->validated();
        $validated['shipping_whatsapp'] = PhoneNumber::normalizeE164($validated['shipping_whatsapp']);

        if ($validated['delivery_method'] === 'store_pickup') {
            $validated['shipping_address'] = $validated['shipping_address'] ?: 'Retrait en boutique';
            $validated['shipping_city'] = $validated['shipping_city'] ?: '—';
            $validated['shipping_district'] = $validated['shipping_district'] ?: '—';
        }

        if (! empty($validated['payment_provider'])) {
            $providerNote = 'Moyen : '.$validated['payment_provider'];
            $validated['customer_note'] = trim(
                ($validated['customer_note'] ?? '')."\n".$providerNote
            );
        }

        if (! empty($validated['payment_phone'])) {
            $validated['payment_phone'] = PhoneNumber::normalizeE164($validated['payment_phone']);
            $validated['customer_note'] = trim(
                ($validated['customer_note'] ?? '')."\nNuméro Mobile Money : ".$validated['payment_phone']
            );
        }

        $grouped = [];
        foreach ($lines as $line) {
            $vendorId = (int) $line['vendor_id'];
            $grouped[$vendorId][] = $line;
        }

        $orderIds = [];

        foreach ($grouped as $vendorId => $vendorLines) {
            $items = [];
            $total = 0.0;

            foreach ($vendorLines as $line) {
                $product = Product::query()->findOrFail($line['product_id']);

                if ($product->status === 'DISCONTINUED') {
                    return back()->withErrors([
                        'cart' => "Le produit « {$product->name} » n'est plus disponible.",
                    ]);
                }

                $qty = (int) $line['quantity'];
                $variantId = isset($line['variant_id']) ? (int) $line['variant_id'] : null;
                $variant = $variantId
                    ? ProductVariant::query()->where('product_id', $product->id)->find($variantId)
                    : null;

                $availableStock = $variant ? $variant->stock : $product->stock;

                if ($availableStock < $qty) {
                    return back()->withErrors([
                        'cart' => "Stock insuffisant pour « {$product->name} ».",
                    ]);
                }

                $unit = (float) $product->price;
                $items[] = [
                    'product_id' => $product->id,
                    'variant_id' => $variant?->id,
                    'quantity' => $qty,
                    'price' => $unit,
                ];
                $total += $unit * $qty;
            }

            $order = $this->orderService->createOrder($customer, OrderData::from([
                'customer_id' => $customer->id,
                'vendor_id' => (int) $vendorId,
                'items' => $items,
                'total' => $total,
                'status' => 'PENDING',
                'delivery_method' => $validated['delivery_method'],
                'shipping_full_name' => $validated['shipping_full_name'],
                'shipping_whatsapp' => $validated['shipping_whatsapp'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_district' => $validated['shipping_district'],
                'payment_method' => $validated['payment_method'],
                'customer_note' => $validated['customer_note'] ?? null,
            ]));

            $orderIds[] = $order->id;
        }

        $this->cartService->clear();

        $redirectOrderId = $orderIds[0];

        return redirect()
            ->route('customer.orders.show', $redirectOrderId)
            ->with('success', count($orderIds) > 1
                ? count($orderIds).' commandes ont été enregistrées.'
                : 'Votre commande a été enregistrée.');
    }
}
