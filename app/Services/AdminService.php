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
    public function analysisWindowStart(string $period): Carbon
    {
        return match ($period) {
            'day' => Carbon::now()->subDay(),
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::now()->subMonth(),
        };
    }

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
        $startDate = $this->analysisWindowStart($period);

        $orders = Order::where('created_at', '>=', $startDate)->get();

        return [
            'period' => $period,
            'total_sales' => (float) $orders->sum(fn (Order $o) => (float) $o->total),
            'total_orders' => $orders->count(),
            'average_order' => (float) ($orders->avg('total') ?? 0),
            'top_products' => $this->getTopProductsForPeriod($period),
            'top_vendors' => $this->getTopVendors($period),
            'top_customers' => $this->getTopCustomers($period),
        ];
    }

    /**
     * Analyse complète (cahier des charges) : indicateurs + journée la plus forte + ruptures à forte demande.
     */
    public function getSalesAnalyticsPayload(string $period): array
    {
        $period = in_array($period, ['day', 'week', 'month', 'year'], true) ? $period : 'month';
        $base = $this->getGlobalSalesAnalysis($period);
        $start = $this->analysisWindowStart($period);

        $ordersInRange = Order::where('created_at', '>=', $start)->get();
        $byDay = $ordersInRange->groupBy(fn (Order $o) => $o->created_at->format('Y-m-d'));
        $bestSalesDay = $byDay
            ->map(fn ($group, string $day) => [
                'date' => $day,
                'revenue' => (float) $group->sum(fn (Order $o) => (float) $o->total),
                'orders' => $group->count(),
            ])
            ->values()
            ->sortByDesc('revenue')
            ->first();

        $highDemandOutOfStock = Product::query()
            ->where('stock', 0)
            ->where('status', 'OUT_OF_STOCK')
            ->with('vendor')
            ->withCount([
                'orderItems as units_sold_window' => function ($q) use ($start) {
                    $q->whereHas('order', fn ($oq) => $oq->where('created_at', '>=', $start));
                },
            ])
            ->orderByDesc('units_sold_window')
            ->limit(8)
            ->get()
            ->map(fn (Product $p) => [
                'id' => $p->id,
                'name' => $p->name,
                'units_sold' => (int) ($p->units_sold_window ?? 0),
                'vendor' => $p->vendor?->shop_name ?? '—',
            ])
            ->values()
            ->all();

        return array_merge($base, [
            'best_sales_day' => $bestSalesDay,
            'high_demand_out_of_stock' => $highDemandOutOfStock,
            'chart_series' => $this->getSalesChartSeries($period),
        ]);
    }

    /**
     * Série temporelle pour graphiques admin (CA + commandes).
     *
     * @return list<array{label: string, revenue: float, orders: int}>
     */
    public function getSalesChartSeries(string $period): array
    {
        $period = in_array($period, ['day', 'week', 'month', 'year'], true) ? $period : 'month';
        $start = $this->analysisWindowStart($period);

        $orders = Order::query()
            ->where('created_at', '>=', $start)
            ->get(['total', 'created_at']);

        $buckets = match ($period) {
            'day' => $this->chartBucketsByHour(),
            'week' => $this->chartBucketsByDay(Carbon::now()->subDays(6)->startOfDay(), 7, 'D'),
            'year' => $this->chartBucketsByMonth(Carbon::now()->subMonths(11)->startOfMonth(), 12),
            default => $this->chartBucketsByDay($start->copy()->startOfDay(), (int) $start->diffInDays(Carbon::now()) + 1, 'd MMM'),
        };

        foreach ($orders as $order) {
            $key = match ($period) {
                'day' => $order->created_at->format('Y-m-d H:00'),
                'year' => $order->created_at->format('Y-m'),
                default => $order->created_at->format('Y-m-d'),
            };

            if (! isset($buckets[$key])) {
                continue;
            }

            $buckets[$key]['revenue'] += (float) $order->total;
            $buckets[$key]['orders'] += 1;
        }

        return array_values($buckets);
    }

    /**
     * @return array<string, array{label: string, revenue: float, orders: int}>
     */
    private function chartBucketsByHour(): array
    {
        $buckets = [];
        for ($i = 23; $i >= 0; $i--) {
            $t = Carbon::now()->subHours($i)->startOfHour();
            $key = $t->format('Y-m-d H:00');
            $buckets[$key] = [
                'label' => $t->format('H\h'),
                'revenue' => 0.0,
                'orders' => 0,
            ];
        }

        return $buckets;
    }

    /**
     * @return array<string, array{label: string, revenue: float, orders: int}>
     */
    private function chartBucketsByDay(Carbon $from, int $count, string $labelFormat): array
    {
        $buckets = [];
        for ($i = 0; $i < $count; $i++) {
            $t = $from->copy()->addDays($i);
            $key = $t->format('Y-m-d');
            $buckets[$key] = [
                'label' => $t->locale('fr')->isoFormat($labelFormat),
                'revenue' => 0.0,
                'orders' => 0,
            ];
        }

        return $buckets;
    }

    /**
     * @return array<string, array{label: string, revenue: float, orders: int}>
     */
    private function chartBucketsByMonth(Carbon $from, int $count): array
    {
        $buckets = [];
        for ($i = 0; $i < $count; $i++) {
            $t = $from->copy()->addMonths($i);
            $key = $t->format('Y-m');
            $buckets[$key] = [
                'label' => $t->locale('fr')->isoFormat('MMM YY'),
                'revenue' => 0.0,
                'orders' => 0,
            ];
        }

        return $buckets;
    }

    public function paginateAdminProducts(string $filter = 'all')
    {
        $query = Product::query()
            ->with(['vendor.user', 'category', 'variants'])
            ->latest('id');

        match ($filter) {
            'in-stock' => $query->where('stock', '>', 0)->where('status', '!=', 'DISCONTINUED'),
            'low-stock' => $query->where('stock', '>', 0)->where('stock', '<', 10),
            'out-of-stock' => $query->where('stock', 0),
            'discontinued' => $query->where('status', 'DISCONTINUED'),
            default => null,
        };

        return $query->paginate(20)->through(function (Product $p) {
            $colors = $p->variants->pluck('color')->unique()->values();

            return [
                'id' => $p->id,
                'name' => $p->name,
                'price' => (float) $p->price,
                'quantity' => $p->stock,
                'status' => $p->status,
                'category' => $p->category?->name,
                'vendor' => ['shop_name' => $p->vendor?->shop_name ?? '—'],
                'variants_count' => $p->variants->count(),
                'colors_count' => $colors->count(),
                'colors' => $colors->all(),
            ];
        });
    }

    public function paginateAdminVendors()
    {
        return Vendor::with('user')
            ->latest('id')
            ->paginate(20)
            ->through(function (Vendor $v) {
                return [
                    'id' => $v->id,
                    'name' => $v->user?->name ?? '—',
                    'email' => $v->user?->email ?? '',
                    'shop_name' => $v->shop_name,
                    'created_at' => $v->created_at?->toIso8601String() ?? '',
                ];
            });
    }

    public function paginateAdminCustomers()
    {
        return Customer::query()
            ->with('user')
            ->withCount('orders')
            ->withSum('orders as total_spent', 'total')
            ->withMax('orders as last_order_at', 'created_at')
            ->latest('id')
            ->paginate(20)
            ->through(function (Customer $c) {
                $ordersCount = (int) ($c->orders_count ?? 0);
                $lastAt = $c->last_order_at ? Carbon::parse($c->last_order_at) : null;
                if ($ordersCount >= 3) {
                    $segment = 'frequent';
                } elseif ($ordersCount === 0) {
                    $segment = 'never_ordered';
                } elseif ($lastAt && $lastAt->lt(Carbon::now()->subDays(180))) {
                    $segment = 'inactive';
                } else {
                    $segment = 'active';
                }

                return [
                    'id' => $c->id,
                    'name' => $c->user?->name ?? '—',
                    'email' => $c->user?->email ?? '',
                    'orders_count' => $ordersCount,
                    'total_spent' => (float) ($c->total_spent ?? 0),
                    'last_order_at' => $c->last_order_at,
                    'segment' => $segment,
                    'created_at' => $c->created_at?->toIso8601String() ?? '',
                ];
            });
    }

    private function getTopProducts(): array
    {
        return $this->getTopProductsForPeriod(null);
    }

    private function getTopProductsForPeriod(?string $period): array
    {
        $startDate = $period !== null ? $this->analysisWindowStart($period) : null;

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
                if (! $item->product) {
                    return null;
                }

                return [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'price' => (float) $item->product->price,
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
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at?->format('d/m/Y H:i') ?? '',
                ];
            })
            ->toArray();
    }

    private function getTopVendors(string $period): array
    {
        $startDate = $this->analysisWindowStart($period);

        return Vendor::with('user')
            ->withCount(['orders' => function ($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
            ->orderByDesc('orders_count')
            ->limit(10)
            ->get()
            ->map(fn (Vendor $v) => [
                'id' => $v->id,
                'shop_name' => $v->shop_name,
                'owner_name' => $v->user?->name ?? '—',
                'orders_count' => (int) ($v->orders_count ?? 0),
            ])
            ->values()
            ->all();
    }

    private function getTopCustomers(string $period): array
    {
        $startDate = $this->analysisWindowStart($period);

        return Customer::with('user')
            ->withCount(['orders' => function ($query) use ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }])
            ->orderByDesc('orders_count')
            ->limit(10)
            ->get()
            ->map(fn (Customer $c) => [
                'id' => $c->id,
                'name' => $c->user?->name ?? '—',
                'email' => $c->user?->email ?? '',
                'orders_count' => (int) ($c->orders_count ?? 0),
            ])
            ->values()
            ->all();
    }
}
