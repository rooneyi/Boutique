<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AdminService;

class ProductController extends Controller
{
    public function __construct(
        private AdminService $adminService,
    ) {}

    public function index()
    {
        $products = $this->adminService->getAllProducts();

        return response()->json([
            'data' => $products,
        ]);
    }

    public function outOfStock()
    {
        $products = $this->adminService->getOutOfStockProducts();

        return response()->json([
            'data' => $products,
        ]);
    }

    public function lowStock()
    {
        $products = $this->adminService->getLowStockProducts();

        return response()->json([
            'data' => $products,
        ]);
    }
}
