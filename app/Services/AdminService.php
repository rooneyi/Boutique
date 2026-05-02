<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
            'avg_order_value' => (float) (Order::avg('total') ?? 0),
            'new_customers' => Customer::where('created_at', '>=', Carbon::now()->subDays(7))->count(),
            'top_products' => $this->getTopProducts(),
            'recent_orders' => $this->getRecentOrders(),
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
            'top_products' => $this->getTopProductsForPeriod($period),
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

    private function getTopProducts(): array
    {
        return $this->getTopProductsForPeriod(null);
    }

    private function getTopProductsForPeriod(?string $period): array
    {
        $startDate = $period ? match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        } : null;

        $query = OrderItem::query()
            ->select('order_items.product_id', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->groupBy('order_items.product_id');

        if ($startDate) {
            $query->where('orders.created_at', '>=', $startDate);
        }

        return $query
            ->with('product')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                if (!$item->product) {
                    return null;
                }

                return [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'stock' => $item->product->stock,
                    'total_sold' => (int) $item->total_sold,
                ];
            })
            ->filter()
            ->values()
            ->toArray();
    }

    private function getRecentOrders(): array
    {
        return Order::with(['customer.user'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->customer?->user?->name ?? 'Inconnu',
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at?->format('d/m/Y H:i') ?? '',
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

}
