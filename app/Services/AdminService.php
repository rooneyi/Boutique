<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Schema;

class AdminService
{
    public function getAdminDashboard(): array
    {
        return [
            'total_vendors' => Vendor::count(),
            'total_customers' => Customer::count(),
            'total_products' => Product::count(),
            'total_sales' => (float) Order::sum('total'),
            'total_orders' => Order::count(),
            'avg_order_value' => Order::avg('total') ?? 0,
        ];
    }

    public function getGlobalSalesAnalysis(string $period = 'month'): array
    {
        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        $orders = Order::where('created_at', '>=', $startDate)->get();

        return [
            'period' => $period,
            'total_sales' => $orders->sum('total'),
            'total_orders' => $orders->count(),
            'average_order' => $orders->avg('total') ?? 0,
            'top_products' => $this->getTopProducts($period),
            'top_vendors' => $this->getTopVendors($period),
            'top_customers' => $this->getTopCustomers($period),
        ];
    }

    public function getOutOfStockProducts()
    {
        return Product::where('stock', 0)->with('vendor.user')->paginate(20);
    }

    public function getLowStockProducts()
    {
        return Product::where('stock', '>', 0)->where('stock', '<', 10)->with('vendor.user')->paginate(20);
    }

    public function getAllProducts()
    {
        return Product::with('vendor.user')->paginate(20);
    }

    public function getAllVendors()
    {
        return Vendor::with('user')->paginate(20);
    }

    public function getAllCustomers()
    {
        return Customer::with('user')->paginate(20);
    }

    private function getTopProducts(string $period): array
    {
        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        return OrderItem::whereHas('order', function ($query) use ($startDate) {
            $query->where('created_at', '>=', $startDate);
        })
        ->select('product_id', \DB::raw('SUM(quantity) as total_sold'))
        ->groupBy('product_id')
        ->with('product')
        ->orderByDesc('total_sold')
        ->limit(10)
        ->get()
        ->map(function ($item) {
            return [
                'product' => $item->product,
                'total_sold' => $item->total_sold,
            ];
        })
        ->toArray();
    }

    private function getTopVendors(string $period): array
    {
        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        return Vendor::with('user')
            ->withCount(['orders' => function ($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
            ->orderByDesc('orders_count')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function getTopCustomers(string $period): array
    {
        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        return Customer::with('user')
            ->withCount(['orders' => function ($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
            ->orderByDesc('orders_count')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function emptyPaginator(): LengthAwarePaginator
    {
        return new LengthAwarePaginator(
            items: [],
            total: 0,
            perPage: 20,
            currentPage: 1,
            options: [
                'path' => request()?->url() ?? '/',
                'pageName' => 'page',
            ]
        );
    }
}
