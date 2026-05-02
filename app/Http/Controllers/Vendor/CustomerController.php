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
}
