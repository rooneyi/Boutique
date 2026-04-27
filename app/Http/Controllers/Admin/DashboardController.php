<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;

class DashboardController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function index()
    {
        $dashboard = $this->adminService->getAdminDashboard();

        return response()->json([
            'data' => $dashboard,
        ]);
    }

    public function salesAnalysis(string $period = 'month')
    {
        $analysis = $this->adminService->getGlobalSalesAnalysis($period);

        return response()->json([
            'data' => $analysis,
        ]);
    }
}
