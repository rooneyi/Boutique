<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Vendor;
use Carbon\Carbon;

class DashboardService
{
    public function getVendorDashboard(Vendor $vendor): array
    {
        $vendorOrders = $vendor->orders();
        
        return [
            'total_sales' => $vendorOrders->sum('total'),
            'total_orders' => $vendorOrders->count(),
            'total_products' => $vendor->products()->count(),
            'total_customers' => $vendorOrders->distinct('customer_id')->count(),
            'avg_order_value' => $vendorOrders->avg('total') ?? 0,
            'low_stock_products' => $vendor->products()->where('stock', '<', 10)->get(),
            'top_products' => $this->getTopProductsForVendor($vendor),
            'recent_orders' => $vendorOrders->latest()->limit(10)->get(),
        ];
    }

    public function getCustomerDashboard(Customer $customer): array
    {
        return [
            'total_orders' => $customer->orders()->count(),
            'total_spent' => $customer->orders()->sum('total'),
            'recent_orders' => $customer->orders()->latest()->limit(5)->get(),
        ];
    }

    public function getSalesAnalysis(Vendor $vendor, string $period = 'month'): array
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
            'total_sales' => $orders->sum('total'),
            'total_orders' => $orders->count(),
            'average_order' => $orders->avg('total') ?? 0,
        ];
    }

    private function getTopProductsForVendor(Vendor $vendor): array
    {
        return $vendor->products()
            ->withCount(['orderItems as total_sold' => function ($query) {
                $query->select(\DB::raw('SUM(quantity)'));
            }])
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get()
            ->toArray();
    }
