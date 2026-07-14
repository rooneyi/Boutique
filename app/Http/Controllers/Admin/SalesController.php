<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Support\PublicStorage;
use Inertia\Inertia;
use Inertia\Response;

class SalesController extends Controller
{
    public function orders(): Response
    {
        $orders = Order::query()
            ->with(['customer.user', 'items.product', 'items.variant'])
            ->latest()
            ->paginate(15);

        $orders->through(function (Order $order) {
            return [
                'id' => $order->id,
                'customer_name' => $order->customer?->user?->name ?? '—',
                'total' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
                'delivery' => $this->deliveryPayload($order),
                'items' => $order->items->map(fn (OrderItem $item) => $this->orderItemPayload($item))->all(),
            ];
        });

        return Inertia::render('admin/sales/orders', [
            'orders' => $orders,
        ]);
    }

    public function customers(): Response
    {
        $customers = Customer::query()
            ->with('user')
            ->withCount(['orders', 'favoriteProducts'])
            ->get()
            ->map(function (Customer $customer) {
                $ordersQuery = Order::query()->where('customer_id', $customer->id);

                return [
                    'id' => $customer->id,
                    'name' => $customer->user?->name ?? '—',
                    'email' => $customer->user?->email ?? '',
                    'phone' => $customer->phone,
                    'birth_date' => $customer->birth_date?->toDateString(),
                    'avatar_url' => $customer->user?->avatar_url,
                    'orders_count' => (int) $customer->orders_count,
                    'favorites_count' => (int) $customer->favorite_products_count,
                    'total_spent' => (float) $ordersQuery->sum('total'),
                    'last_order_at' => optional($ordersQuery->max('created_at')),
                    'member_since' => $customer->created_at?->toIso8601String(),
                ];
            })
            ->sortByDesc('total_spent')
            ->values()
            ->all();

        return Inertia::render('admin/sales/customers', [
            'customers' => $customers,
        ]);
    }

    public function customer(Customer $customer): Response
    {
        $customer->load('user');
        $customer->loadCount(['orders', 'favoriteProducts', 'productReviews']);

        $orders = Order::query()
            ->where('customer_id', $customer->id)
            ->with(['items.product', 'items.variant'])
            ->latest()
            ->get();

        $ordersPayload = $orders->map(function (Order $order) {
            return [
                'id' => $order->id,
                'total' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
                'delivery' => $this->deliveryPayload($order),
                'payment_method' => $order->payment_method,
                'items' => $order->items->map(fn (OrderItem $item) => $this->orderItemPayload($item))->all(),
            ];
        })->all();

        $ordersCount = count($ordersPayload);
        $totalSpent = array_sum(array_column($ordersPayload, 'total'));
        $lastOrderAt = $ordersPayload[0]['created_at'] ?? null;

        $lastDelivery = $orders->first(
            fn (Order $order) => filled($order->shipping_whatsapp)
                || filled($order->shipping_address)
                || filled($order->shipping_city)
                || filled($order->delivery_method),
        );

        $topCategories = OrderItem::query()
            ->whereHas('order', fn ($q) => $q->where('customer_id', $customer->id))
            ->whereHas('product.category')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as name, SUM(order_items.quantity) as quantity')
            ->groupBy('categories.name')
            ->orderByDesc('quantity')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'name' => (string) $row->name,
                'quantity' => (int) $row->quantity,
            ])
            ->all();

        return Inertia::render('admin/sales/customer-show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->user?->name ?? '—',
                'email' => $customer->user?->email ?? '',
                'phone' => $customer->phone,
                'birth_date' => $customer->birth_date?->toDateString(),
                'avatar_url' => $customer->user?->avatar_url,
                'email_verified' => $customer->user?->email_verified_at !== null,
                'member_since' => $customer->created_at?->toIso8601String(),
                'orders_count' => $ordersCount,
                'favorites_count' => (int) $customer->favorite_products_count,
                'reviews_count' => (int) $customer->product_reviews_count,
                'total_spent' => $totalSpent,
                'last_order_at' => $lastOrderAt,
                'last_delivery' => $lastDelivery === null ? null : $this->deliveryPayload($lastDelivery),
                'top_categories' => $topCategories,
            ],
            'orders' => $ordersPayload,
        ]);
    }

    /**
     * @return array{
     *     method: ?string,
     *     method_label: string,
     *     full_name: ?string,
     *     whatsapp: ?string,
     *     address: ?string,
     *     city: ?string,
     *     district: ?string
     * }
     */
    private function deliveryPayload(Order $order): array
    {
        $method = $order->delivery_method;

        if ($method === null || $method === '') {
            $method = filled($order->shipping_address) && $order->shipping_address !== 'Retrait en boutique'
                ? 'home_delivery'
                : (filled($order->shipping_whatsapp) ? 'store_pickup' : null);
        }

        return [
            'method' => $method,
            'method_label' => match ($method) {
                'home_delivery' => 'Livraison à domicile',
                'store_pickup' => 'Retrait en boutique',
                default => 'Non renseigné',
            },
            'full_name' => $order->shipping_full_name,
            'whatsapp' => $order->shipping_whatsapp,
            'address' => $order->shipping_address,
            'city' => $order->shipping_city,
            'district' => $order->shipping_district,
        ];
    }

    /**
     * @return array{product_name: string, quantity: int, line_total: float, image_path: ?string, color: ?string, color_hex: ?string, size: ?string}
     */
    private function orderItemPayload(OrderItem $item): array
    {
        $variant = $item->variant;
        $product = $item->product;
        $imagePath = $variant?->image ?: $product?->image;

        return [
            'product_name' => $product?->name ?? '—',
            'quantity' => $item->quantity,
            'line_total' => (float) ($item->price * $item->quantity),
            'image_path' => PublicStorage::url($imagePath),
            'color' => $variant?->color,
            'color_hex' => $variant?->color_hex,
            'size' => $variant?->size,
        ];
    }
}
