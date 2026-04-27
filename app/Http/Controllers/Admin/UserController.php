<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;

class UserController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function vendors()
    {
        $vendors = $this->adminService->getAllVendors();

        return response()->json([
            'data' => $vendors,
        ]);
    }

    public function customers()
    {
        $customers = $this->adminService->getAllCustomers();

        return response()->json([
            'data' => $customers,
        ]);
    }
}
