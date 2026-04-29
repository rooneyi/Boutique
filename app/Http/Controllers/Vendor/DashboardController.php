<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService,
    ) {}

    public function index()
    {
        $dashboard = $this->dashboardService->getVendorDashboard(auth()->user()->vendor);

        return response()->json([
            'data' => $dashboard,
        ]);
    }

    public function salesAnalysis(string $period = 'month')
    {
        $analysis = $this->dashboardService->getSalesAnalysis(auth()->user()->vendor, $period);

        return response()->json([
            'data' => $analysis,
        ]);
    }
}
