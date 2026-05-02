<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getVendorDashboard(Vendor $vendor): array
    {
        $recentOrders = $vendor->orders()
            ->with('customer.user')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'customer' => ['name' => $order->customer?->user?->name ?? '—'],
                'total_amount' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toIso8601String() ?? '',
            ])
            ->all();

        $lowStockRows = $vendor->products()
            ->where('stock', '<', 10)
            ->where('stock', '>', 0)
            ->orderBy('stock')
            ->limit(20)
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'stock' => $p->stock,
                'price' => (float) $p->price,
                'status' => $p->status,
            ])
            ->all();

        return [
            'total_sales' => (float) $vendor->orders()->sum('total'),
            'total_orders' => $vendor->orders()->count(),
            'total_products' => $vendor->products()->count(),
            'total_customers' => (int) Order::where('vendor_id', $vendor->id)
                ->distinct('customer_id')
                ->count('customer_id'),
            'avg_order_value' => (float) ($vendor->orders()->avg('total') ?? 0),
            'low_stock_products' => $lowStockRows,
            'top_products' => $this->getTopProductsForVendor($vendor),
            'loyal_customers' => $this->getLoyalCustomersForVendor($vendor),
            'recent_orders' => $recentOrders,
        ];
    }

    /**
     * @return list<array{id: int, name: string, orders_count: int, total_spent: float}>
     */
    private function getLoyalCustomersForVendor(Vendor $vendor, int $limit = 5): array
    {
        $rows = Order::query()
            ->where('vendor_id', $vendor->id)
            ->select('customer_id', DB::raw('COUNT(*) as orders_count'), DB::raw('SUM(total) as total_spent'))
            ->groupBy('customer_id')
            ->orderByDesc('total_spent')
            ->limit($limit)
            ->get();

        $customerIds = $rows->pluck('customer_id')->all();
        $customers = Customer::query()->whereIn('id', $customerIds)->with('user')->get()->keyBy('id');

        return $rows->map(function ($row) use ($customers) {
            $c = $customers->get($row->customer_id);

            return [
                'id' => (int) $row->customer_id,
                'name' => $c?->user?->name ?? '—',
                'orders_count' => (int) $row->orders_count,
                'total_spent' => (float) $row->total_spent,
            ];
        })->values()->all();
    }

    public function getCustomerDashboard(Customer $customer): array
    {
        return [
            'total_orders' => $customer->orders()->count(),
            'total_spent' => (float) $customer->orders()->sum('total'),
            'recent_orders' => $customer->orders()->latest()->limit(5)->get(),
        ];
    }

    public function getSalesAnalysis(Vendor $vendor, string $period = 'month'): array
    {
        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        $orders = $vendor->orders()->where('created_at', '>=', $startDate)->get();

        return [
            'period' => $period,
            'total_sales' => (float) $orders->sum('total'),
            'total_orders' => $orders->count(),
            'average_order' => (float) ($orders->avg('total') ?? 0),
        ];
    }

    private function getTopProductsForVendor(Vendor $vendor): array
    {
        return Product::query()
            ->where('vendor_id', $vendor->id)
            ->withSum('orderItems as sold_quantity', 'quantity')
            ->orderByDesc('sold_quantity')
            ->limit(5)
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float) $p->price,
                'orders_count' => (int) ($p->sold_quantity ?? 0),
            ])
            ->all();
    }
}
