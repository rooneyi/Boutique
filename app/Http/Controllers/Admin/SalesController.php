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
            ->get()
            ->map(function (Customer $customer) {
                $ordersForCustomer = fn () => Order::query()
                    ->where('customer_id', $customer->id);

                return [
                    'id' => $customer->id,
                    'name' => $customer->user?->name ?? '—',
                    'email' => $customer->user?->email ?? '',
                    'orders_count' => (int) $ordersForCustomer()->count(),
                    'total_spent' => (float) $ordersForCustomer()->sum('total'),
                    'last_order_at' => optional($ordersForCustomer()->max('created_at')),
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
        $orders = Order::query()
            ->where('customer_id', $customer->id)
            ->with(['items.product', 'items.variant'])
            ->latest()
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at?->toIso8601String() ?? '',
                    'items' => $order->items->map(fn (OrderItem $item) => $this->orderItemPayload($item))->all(),
                ];
            })
            ->all();

        $ordersCount = count($orders);
        $totalSpent = array_sum(array_column($orders, 'total'));
        $lastOrderAt = $orders[0]['created_at'] ?? null;

        return Inertia::render('admin/sales/customer-show', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->user?->name ?? '—',
                'email' => $customer->user?->email ?? '',
                'orders_count' => $ordersCount,
                'total_spent' => $totalSpent,
                'last_order_at' => $lastOrderAt,
            ],
            'orders' => $orders,
        ]);
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
