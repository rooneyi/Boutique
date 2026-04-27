<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService,
    ) {}

    public function index()
    {
        $dashboard = $this->dashboardService->getCustomerDashboard(auth()->user());

        return response()->json([
            'data' => $dashboard,
        ]);
    }
}
