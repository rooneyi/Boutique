<?php

// app/routes/boutique-api.php
// À intégrer à routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Vendor\ProductController as VendorProductController;
use App\Http\Controllers\Vendor\DashboardController as VendorDashboardController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\UserController as AdminUserController;

// Public Routes
Route::middleware('guest')->group(function () {
    Route::post('/auth/vendor/register', [AuthController::class, 'registerVendor']);
    Route::post('/auth/customer/register', [AuthController::class, 'registerCustomer']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Vendor Routes
    Route::middleware('vendor')->prefix('vendor')->group(function () {
        Route::apiResource('products', VendorProductController::class);
        Route::get('products/{product}/stock-status', [VendorProductController::class, 'getStockStatus']);
        
        Route::get('dashboard', [VendorDashboardController::class, 'index']);
        Route::get('dashboard/sales-analysis/{period}', [VendorDashboardController::class, 'salesAnalysis']);
    });

    // Customer Routes
    Route::middleware('customer')->prefix('customer')->group(function () {
        Route::post('orders', [CustomerOrderController::class, 'store']);
        Route::get('orders', [CustomerOrderController::class, 'index']);
        Route::get('orders/{order}', [CustomerOrderController::class, 'show']);
        
        Route::get('dashboard', [CustomerDashboardController::class, 'index']);
    });

    // Admin Routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index']);
        Route::get('dashboard/sales-analysis/{period}', [AdminDashboardController::class, 'salesAnalysis']);
        
        Route::get('products', [AdminProductController::class, 'index']);
        Route::get('products/out-of-stock', [AdminProductController::class, 'outOfStock']);
        Route::get('products/low-stock', [AdminProductController::class, 'lowStock']);
        
        Route::get('users/vendors', [AdminUserController::class, 'vendors']);
        Route::get('users/customers', [AdminUserController::class, 'customers']);
    });
});
