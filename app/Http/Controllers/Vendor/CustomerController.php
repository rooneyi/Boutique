<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        $vendor = auth()->user()->vendor;

        $customerIds = Order::query()
            ->where('vendor_id', $vendor->id)
            ->distinct()
            ->pluck('customer_id');

        $customers = Customer::query()
            ->whereIn('id', $customerIds)
            ->with('user')
            ->get()
            ->map(function (Customer $customer) use ($vendor) {
                $ordersForCustomer = fn () => Order::query()
                    ->where('vendor_id', $vendor->id)
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

        return Inertia::render('vendor/customers/index', [
            'customers' => $customers,
        ]);
    }

    public function show(Customer $customer): Response
    {
        $vendor = auth()->user()->vendor;

        $hasOrders = Order::query()
            ->where('vendor_id', $vendor->id)
            ->where('customer_id', $customer->id)
            ->exists();

        abort_unless($hasOrders, 404);

        $orders = Order::query()
            ->where('vendor_id', $vendor->id)
            ->where('customer_id', $customer->id)
            ->with(['items.product'])
            ->latest()
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at?->toIso8601String() ?? '',
                    'items' => $order->items->map(fn ($item) => [
                        'product_name' => $item->product?->name ?? '—',
                        'quantity' => $item->quantity,
                        'line_total' => (float) ($item->price * $item->quantity),
                    ])->all(),
                ];
            })
            ->all();

        $ordersCount = count($orders);
        $totalSpent = array_sum(array_column($orders, 'total'));
        $lastOrderAt = $orders[0]['created_at'] ?? null;

        return Inertia::render('vendor/customers/show', [
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
}
