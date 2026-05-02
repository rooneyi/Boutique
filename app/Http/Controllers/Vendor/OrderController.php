<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $vendor = auth()->user()->vendor;

        $orders = Order::query()
            ->where('vendor_id', $vendor->id)
            ->with(['customer.user', 'items.product'])
            ->latest()
            ->paginate(15);

        $orders->through(function (Order $order) {
            return [
                'id' => $order->id,
                'customer_name' => $order->customer?->user?->name ?? '—',
                'total' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
                'items' => $order->items->map(fn ($item) => [
                    'product_name' => $item->product?->name ?? '—',
                    'quantity' => $item->quantity,
                    'line_total' => (float) ($item->price * $item->quantity),
                ])->all(),
            ];
        });

        return Inertia::render('vendor/orders/index', [
            'orders' => $orders,
        ]);
    }
}
