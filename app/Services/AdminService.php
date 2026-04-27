<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Schema;

class AdminService
{
    public function getAdminDashboard(): array
    {
        $hasUsers = Schema::hasTable('users');
        $hasProducts = Schema::hasTable('products');
        $hasOrders = Schema::hasTable('orders');
        $hasIsVendor = $hasUsers && Schema::hasColumn('users', 'is_vendor');

        return [
            'total_vendors' => $hasIsVendor ? User::where('is_vendor', true)->count() : 0,
            'total_customers' => $hasIsVendor ? User::where('is_vendor', false)->count() : ($hasUsers ? User::count() : 0),
            'total_products' => $hasProducts ? Product::count() : 0,
            'total_sales' => $hasOrders ? (float) Order::sum('total_amount') : 0,
            'total_orders' => $hasOrders ? Order::count() : 0,
            'avg_order_value' => $hasOrders ? (Order::avg('total_amount') ?? 0) : 0,
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
            'total_sales' => $orders->sum('total_amount'),
            'total_orders' => $orders->count(),
            'average_order' => $orders->avg('total_amount') ?? 0,
            'top_products' => $this->getTopProducts($period),
            'top_vendors' => $this->getTopVendors($period),
            'top_customers' => $this->getTopCustomers($period),
        ];
    }

    public function getOutOfStockProducts()
    {
        if (!Schema::hasTable('products')) {
            return $this->emptyPaginator();
        }

        return Product::where('quantity', 0)->with('vendor')->paginate(20);
    }

    public function getLowStockProducts()
    {
        if (!Schema::hasTable('products')) {
            return $this->emptyPaginator();
        }

        return Product::where('quantity', '>', 0)->where('quantity', '<', 10)->with('vendor')->paginate(20);
    }

    public function getAllProducts()
    {
        if (!Schema::hasTable('products')) {
            return $this->emptyPaginator();
        }

        return Product::with('vendor')->paginate(20);
    }

    public function getAllVendors()
    {
        if (!Schema::hasTable('users') || !Schema::hasColumn('users', 'is_vendor')) {
            return $this->emptyPaginator();
        }

        return User::where('is_vendor', true)->paginate(20);
    }

    public function getAllCustomers()
    {
        if (!Schema::hasTable('users') || !Schema::hasColumn('users', 'is_vendor')) {
            return $this->emptyPaginator();
        }

        return User::where('is_vendor', false)->paginate(20);
    }

    private function getTopProducts(string $period): array
    {
        if (!Schema::hasTable('products') || !Schema::hasTable('orders') || !Schema::hasTable('order_items')) {
            return [];
        }

        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        return Product::whereHas('orders', function ($query) use ($startDate) {
            $query->where('created_at', '>=', $startDate);
        })
        ->withCount('orders')
        ->orderByDesc('orders_count')
        ->limit(10)
        ->get()
        ->toArray();
    }

    private function getTopVendors(string $period): array
    {
        if (!Schema::hasTable('users') || !Schema::hasTable('orders') || !Schema::hasColumn('users', 'is_vendor')) {
            return [];
        }

        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        return User::where('is_vendor', true)
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
        if (!Schema::hasTable('users') || !Schema::hasTable('orders') || !Schema::hasColumn('users', 'is_vendor')) {
            return [];
        }

        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        return User::where('is_vendor', false)
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
