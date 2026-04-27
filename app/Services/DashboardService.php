<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
    public function getVendorDashboard(User $vendor): array
    {
        $vendorOrders = $vendor->orders();
        
        return [
            'total_sales' => $vendorOrders->sum('total_amount'),
            'total_orders' => $vendorOrders->count(),
            'total_products' => $vendor->products()->count(),
            'total_customers' => $vendor->customers()->distinct()->count(),
            'avg_order_value' => $vendorOrders->avg('total_amount') ?? 0,
            'low_stock_products' => $vendor->products()->where('quantity', '<', 10)->get(),
            'top_products' => $vendor->products()
                ->withCount('orders')
                ->orderByDesc('orders_count')
                ->limit(5)
                ->get(),
            'recent_orders' => $vendorOrders->latest()->limit(10)->get(),
        ];
    }

    public function getCustomerDashboard(User $customer): array
    {
        return [
            'total_orders' => $customer->orders()->count(),
            'total_spent' => $customer->orders()->sum('total_amount'),
            'recent_orders' => $customer->orders()->latest()->limit(5)->get(),
        ];
    }

    public function getSalesAnalysis(User $vendor, string $period = 'month'): array
    {
        $vendorOrders = $vendor->orders();

        $startDate = match ($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };

        $orders = $vendorOrders->where('created_at', '>=', $startDate)->get();

        return [
            'period' => $period,
            'total_sales' => $orders->sum('total_amount'),
            'total_orders' => $orders->count(),
            'average_order' => $orders->avg('total_amount') ?? 0,
        ];
    }
}
