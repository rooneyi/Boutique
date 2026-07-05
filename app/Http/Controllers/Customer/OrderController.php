<?php

namespace App\Http\Controllers\Customer;

use App\Data\OrderData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use App\Support\PublicStorage;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

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

        $items = $order->items->map(fn ($item) => [
            'product_name' => $item->product?->name ?? '—',
            'quantity' => $item->quantity,
            'line_total' => (float) ($item->price * $item->quantity),
            'image_path' => PublicStorage::url($item->product?->image),
        ])->all();

        $subtotal = array_sum(array_column($items, 'line_total'));

        return Inertia::render('customer/orders/show', [
            'order' => [
                'id' => $order->id,
                'total_amount' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
                'shipping_full_name' => $order->shipping_full_name,
                'shipping_whatsapp' => $order->shipping_whatsapp,
                'shipping_address' => $order->shipping_address,
                'shipping_city' => $order->shipping_city,
                'shipping_district' => $order->shipping_district,
                'payment_method' => $order->payment_method,
                'customer_note' => $order->customer_note,
                'vendor' => [
                    'shop_name' => $order->vendor->shop_name,
                ],
                'items' => $items,
            ],
            'subtotal' => $subtotal,
            'shipping' => 0,
            'canRegister' => Features::enabled(Features::registration()),
            'whatsappPhone' => '243991934590',
            'supportPhone' => '+243 991 934 590',
            'supportEmail' => 'posecommejamais@gmail.com',
        ]);
    }
}
