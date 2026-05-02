<?php

use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Vendor\CustomerController as VendorCustomerController;
use App\Http\Controllers\Vendor\OrderController as VendorOrderController;
use App\Http\Controllers\Vendor\ProductController as VendorProductController;
use App\Services\AdminService;
use App\Data\CustomerRegisterData;
use App\Data\VendorRegisterData;
use App\Services\CustomerService;
use App\Services\DashboardService;
use App\Services\VendorService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = request()->user();

        if ($user?->role === 'ADMIN') {
            return Inertia::location(route('admin.dashboard'));
        }

        if ($user?->role === 'VENDOR') {
            return Inertia::location(route('vendor.dashboard'));
        }

        return Inertia::location(route('customer.products.index'));
    })->name('dashboard');
});

Route::middleware('guest')->get('admin/login', function () {
    return redirect()->route('login');
})->name('admin.login');

// Auth routes using existing pages
Route::middleware('guest')->prefix('auth')->name('auth.')->group(function () {
    Route::get('login', fn() => Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('login');

    Route::get('vendor/register', fn() => Inertia::render('auth/register-vendor', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('vendor.register');

    Route::get('customer/register', fn() => Inertia::render('auth/register-customer', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('customer.register');

    Route::get('register', fn() => Inertia::render('auth/register', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('register');

    Route::get('register-vendor', fn() => Inertia::render('auth/register-vendor', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('register-vendor');

    Route::get('register-customer', fn() => Inertia::render('auth/register-customer', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('register-customer');

    Route::get('forgot-password', fn() => Inertia::render('auth/forgot-password', [
        'status' => session('status'),
    ]))->name('forgot-password');

    Route::get('reset-password/{token}', fn($token) => Inertia::render('auth/reset-password', [
        'email' => request('email'),
        'token' => $token,
    ]))->name('reset-password');

    Route::post('vendor/register', function (Request $request) {
        $data = VendorRegisterData::from($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'shop_name' => ['required', 'string', 'max:150'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]));

        $user = app(VendorService::class)->register($data);

        auth()->login($user);
        $request->session()->regenerate();

        return redirect()->route('vendor.dashboard');
    })->name('vendor.register.store');

    Route::post('customer/register', function (Request $request) {
        $data = CustomerRegisterData::from($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]));

        $user = app(CustomerService::class)->register($data);

        auth()->login($user);
        $request->session()->regenerate();

        return redirect()->route('customer.products.index');
    })->name('customer.register.store');
});

Route::middleware('auth')->prefix('auth')->name('auth.')->group(function () {
    Route::get('verify-email', fn() => Inertia::render('auth/verify-email', [
        'status' => session('status'),
    ]))->name('verify-email');

    Route::get('confirm-password', fn() => Inertia::render('auth/confirm-password'))->name('confirm-password');

    Route::get('two-factor-challenge', fn() => Inertia::render('auth/two-factor-challenge'))->name('two-factor-challenge');
});

Route::middleware(['auth', 'verified', 'vendor'])->prefix('vendor')->name('vendor.')->group(function () {
    Route::get('dashboard', function (DashboardService $dashboardService) {
        return Inertia::render('vendor/dashboard', [
            'stats' => $dashboardService->getVendorDashboard(auth()->user()->vendor),
        ]);
    })->name('dashboard');

    Route::get('products', [VendorProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [VendorProductController::class, 'create'])->name('products.create');
    Route::post('products', [VendorProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}/edit', [VendorProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [VendorProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [VendorProductController::class, 'destroy'])->name('products.destroy');

    Route::get('orders', [VendorOrderController::class, 'index'])->name('orders.index');
    Route::get('customers', [VendorCustomerController::class, 'index'])->name('customers.index');

    Route::get('settings', fn() => redirect()->route('settings.profile'))->name('settings');
});

Route::middleware(['auth', 'verified', 'customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('products', [CustomerProductController::class, 'index'])->name('products.index');
    Route::get('products/{product}', [CustomerProductController::class, 'show'])->name('products.show');

    Route::get('orders', [CustomerOrderController::class, 'index'])->name('orders.index');
    Route::post('orders', [CustomerOrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');

    Route::get('cart', fn() => redirect()->route('customer.products.index'))->name('cart');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function (AdminService $adminService) {
        return Inertia::render('admin/dashboard', [
            'stats' => $adminService->getAdminDashboard(),
        ]);
    })->name('dashboard');

    Route::get('products', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->getAllProducts(),
            'filter' => 'all',
        ]);
    })->name('products.index');

    Route::get('products/low-stock', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->getLowStockProducts(),
            'filter' => 'low-stock',
        ]);
    })->name('products.low-stock');

    Route::get('products/out-of-stock', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->getOutOfStockProducts(),
            'filter' => 'out-of-stock',
        ]);
    })->name('products.out-of-stock');

    Route::get('users/vendors', function (AdminService $adminService) {
        return Inertia::render('admin/users/index', [
            'users' => $adminService->getAllVendors(),
            'role' => 'vendor',
        ]);
    })->name('vendors.index');

    Route::get('users/customers', function (AdminService $adminService) {
        return Inertia::render('admin/users/index', [
            'users' => $adminService->getAllCustomers(),
            'role' => 'customer',
        ]);
    })->name('customers.index');
});

require __DIR__.'/settings.php';
