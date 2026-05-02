<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Models\Order;
use App\Models\Product;
use App\Data\OrderData;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
    ) {}

    public function store(CreateOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $customer = auth()->user()->customer;
        $vendorId = (int) $validated['vendor_id'];

        $items = [];
        $total = 0.0;

        foreach ($validated['items'] as $row) {
            $product = Product::query()->whereKey($row['product_id'])->firstOrFail();

            if ($product->vendor_id !== $vendorId) {
                abort(422, 'Tous les articles doivent provenir de la même boutique.');
            }

            if ($product->status === 'DISCONTINUED') {
                abort(422, "Le produit « {$product->name} » n'est plus disponible.");
            }

            $qty = (int) $row['quantity'];
            $unit = (float) $product->price;

            if ($product->stock < $qty) {
                abort(422, "Stock insuffisant pour « {$product->name} ».");
            }

            $items[] = [
                'product_id' => $product->id,
                'quantity' => $qty,
                'price' => $unit,
            ];
            $total += $unit * $qty;
        }

        $data = OrderData::from([
            'customer_id' => $customer->id,
            'vendor_id' => $vendorId,
            'items' => $items,
            'total' => $total,
            'status' => 'PAID',
        ]);

        $order = $this->orderService->createOrder($customer, $data);

        return response()->json([
            'message' => 'Commande créée avec succès',
            'data' => $order,
        ], 201);
    }

    public function index(): Response
    {
        $orders = $this->orderService->getCustomerOrders(auth()->user()->customer);

        $orders->through(function (Order $order) {
            return [
                'id' => $order->id,
                'total_amount' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product?->name ?? '—',
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                ])->all(),
            ];
        });

        return Inertia::render('customer/orders/index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load(['items.product', 'vendor']);

        return Inertia::render('customer/orders/show', [
            'order' => [
                'id' => $order->id,
                'total_amount' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
                'vendor' => [
                    'shop_name' => $order->vendor->shop_name,
                ],
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product?->name ?? '—',
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->price,
                    'line_total' => (float) ($item->price * $item->quantity),
                ])->all(),
            ],
        ]);
    }
}
