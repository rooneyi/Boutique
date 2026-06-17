<?php

use App\Data\CustomerRegisterData;
use App\Http\Controllers\Admin\SalesController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\PasswordResetOtpController;
use App\Http\Controllers\Customer\AboutController;
use App\Http\Controllers\Customer\AccountController;
use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\ContactController;
use App\Http\Controllers\Customer\FavoriteController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Customer\ProductReviewController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductReview;
use App\Services\AdminService;
use App\Services\CustomerService;
use App\Support\CatalogProduct;
use App\Support\StorefrontCurated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = request()->user();

        if ($user?->role === 'ADMIN') {
            return Inertia::location(route('admin.dashboard'));
        }

        return Inertia::location(route('home'));
    })->name('dashboard');
});

Route::middleware('guest')->get('admin/login', function () {
    return redirect()->route('login');
})->name('admin.login');

// Auth routes using existing pages
Route::middleware('guest')->prefix('auth')->name('auth.')->group(function () {
    Route::get('login', fn () => Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('login');

    Route::get('customer/register', fn () => Inertia::render('auth/register-customer', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('customer.register');

    Route::get('customer/register/birth', function () {
        if (! session()->has('customer_register_pending')) {
            return redirect()->route('auth.customer.register');
        }

        return Inertia::render('auth/register-customer-birth', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    })->name('customer.register.birth');

    Route::get('register', fn () => Inertia::render('auth/register', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('register');

    Route::get('register-customer', fn () => Inertia::render('auth/register-customer', [
        'canRegister' => Features::enabled(Features::registration()),
    ]))->name('register-customer');

    Route::get('forgot-password', fn () => Inertia::render('auth/forgot-password', [
        'status' => session('status'),
    ]))->name('forgot-password');

    Route::get('forgot-password/phone', fn () => Inertia::render('auth/forgot-password-phone', [
        'status' => session('status'),
    ]))->name('forgot-password.phone');

    Route::get('google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
    Route::get('google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

    Route::post('forgot-password', [PasswordResetOtpController::class, 'sendEmail'])
        ->name('forgot-password.store');

    Route::post('forgot-password/phone', [PasswordResetOtpController::class, 'sendPhone'])
        ->name('forgot-password.phone.store');

    Route::get('forgot-password/verify', [PasswordResetOtpController::class, 'showVerify'])
        ->name('forgot-password.verify');

    Route::post('forgot-password/verify', [PasswordResetOtpController::class, 'verify'])
        ->name('forgot-password.verify.store');

    Route::post('forgot-password/verify/resend', [PasswordResetOtpController::class, 'resend'])
        ->name('forgot-password.verify.resend');

    Route::get('reset-password/{token}', fn ($token) => Inertia::render('auth/reset-password', [
        'email' => request('email'),
        'token' => $token,
    ]))->name('reset-password');

    Route::post('customer/register', function (Request $request) {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['required', 'string', 'max:50'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $request->session()->put('customer_register_pending', [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => $validated['password'],
        ]);

        return redirect()->route('auth.customer.register.birth');
    })->name('customer.register.store');

    Route::post('customer/register/birth', function (Request $request) {
        $pending = $request->session()->get('customer_register_pending');

        if (! is_array($pending)) {
            return redirect()->route('auth.customer.register');
        }

        $validated = $request->validate([
            'birth_date' => ['required', 'date', 'before:today', 'after:1900-01-01'],
        ]);

        $data = CustomerRegisterData::from([
            'name' => trim($pending['first_name'].' '.$pending['last_name']),
            'email' => $pending['email'],
            'password' => $pending['password'],
            'phone' => $pending['phone'],
            'birth_date' => $validated['birth_date'],
        ]);

        $user = app(CustomerService::class)->register($data);

        $request->session()->forget('customer_register_pending');

        auth()->login($user);
        $request->session()->regenerate();

        return redirect()->route('home');
    })->name('customer.register.birth.store');
});

Route::middleware('auth')->prefix('auth')->name('auth.')->group(function () {
    Route::get('verify-email', fn () => Inertia::render('auth/verify-email', [
        'status' => session('status'),
    ]))->name('verify-email');

    Route::get('confirm-password', fn () => Inertia::render('auth/confirm-password'))->name('confirm-password');

    Route::get('two-factor-challenge', fn () => Inertia::render('auth/two-factor-challenge'))->name('two-factor-challenge');
});

Route::get('/', function () {
    $favoriteIdSet = [];
    $user = auth()->user();
    $customer = $user?->role === 'CUSTOMER' ? $user->customer : null;
    if ($customer) {
        $favoriteIdSet = $customer->favoriteProducts()->pluck('products.id')->flip()->all();
    }

    $featured = Product::query()
        ->where('status', '!=', 'DISCONTINUED')
        ->with(['category', 'vendor', 'variants' => fn ($q) => $q->orderBy('id')])
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->latest()
        ->limit(4)
        ->get()
        ->map(function (Product $p) use ($favoriteIdSet) {
            $card = CatalogProduct::compactCardPayload($p, isset($favoriteIdSet[$p->id]));

            return array_merge($card, [
                'vendor_shop' => $p->vendor->shop_name,
                'category' => $p->category?->name ?? '',
            ]);
        });

    $highlightCategories = Category::query()
        ->withCount([
            'products as active_count' => fn ($q) => $q->where('status', '!=', 'DISCONTINUED'),
        ])
        ->orderBy('name')
        ->limit(6)
        ->get()
        ->map(fn (Category $c) => [
            'id' => $c->id,
            'name' => $c->name,
            'count' => (int) $c->active_count,
        ]);

    $testimonials = ProductReview::query()
        ->whereNotNull('comment')
        ->where('comment', '!=', '')
        ->with(['customer.user', 'product'])
        ->latest()
        ->get()
        ->map(static function (ProductReview $review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'author' => $review->customer->user?->name ?? 'Client',
                'product_name' => $review->product->name,
            ];
        })
        ->values()
        ->all();

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'featuredProducts' => $featured,
        'curatedProducts' => StorefrontCurated::products(4),
        'highlightCategories' => $highlightCategories,
        'testimonials' => $testimonials,
    ]);
})->name('home');

Route::get('about', [AboutController::class, 'index'])->name('about');

Route::get('contact', [ContactController::class, 'index'])->name('contact');
Route::post('contact', [ContactController::class, 'store'])->name('contact.store');

Route::prefix('customer')->name('customer.')->group(function () {
    Route::get('products', [CustomerProductController::class, 'index'])->name('products.index');
    Route::get('products/{product}', [CustomerProductController::class, 'show'])->name('products.show');

    Route::get('cart', [CartController::class, 'index'])->name('cart');
    Route::get('cart/preview', [CartController::class, 'preview'])->name('cart.preview');
    Route::post('cart/items', [CartController::class, 'store'])->name('cart.items.store');
    Route::patch('cart/items/{product}', [CartController::class, 'update'])->name('cart.items.update');
    Route::delete('cart/items/{product}', [CartController::class, 'destroy'])->name('cart.items.destroy');

    Route::get('checkout', [CheckoutController::class, 'create'])->name('checkout');
});

Route::middleware(['auth', 'verified', 'customer'])->group(function () {
    Route::prefix('customer')->name('customer.')->group(function () {
        Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout.store');

        Route::get('account', [AccountController::class, 'index'])->name('account');
        Route::get('account/preview', [AccountController::class, 'preview'])->name('account.preview');

        Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');
        Route::get('favorites/preview', [FavoriteController::class, 'preview'])->name('favorites.preview');
        Route::post('favorites/{product}', [FavoriteController::class, 'store'])->name('favorites.store');
        Route::delete('favorites/{product}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');

        Route::post('products/{product}/reviews', [ProductReviewController::class, 'store'])->name('products.reviews.store');

        Route::get('orders', [CustomerOrderController::class, 'index'])->name('orders.index');
        Route::post('orders', [CustomerOrderController::class, 'store'])->name('orders.store');
        Route::get('orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
    });
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', function (AdminService $adminService) {
        return Inertia::render('admin/dashboard', [
            'stats' => $adminService->getAdminDashboard(),
        ]);
    })->name('dashboard');

    Route::get('analytics/sales', function (Request $request, AdminService $adminService) {
        $period = $request->query('period', 'month');
        if (! in_array($period, ['day', 'week', 'month', 'year'], true)) {
            $period = 'month';
        }

        return Inertia::render('admin/analytics', [
            'period' => $period,
            'analytics' => $adminService->getSalesAnalyticsPayload($period),
        ]);
    })->name('analytics.sales');

    Route::get('products', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->paginateAdminProducts('all'),
            'filter' => 'all',
        ]);
    })->name('products.index');

    Route::get('products/in-stock', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->paginateAdminProducts('in-stock'),
            'filter' => 'in-stock',
        ]);
    })->name('products.in-stock');

    Route::get('products/low-stock', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->paginateAdminProducts('low-stock'),
            'filter' => 'low-stock',
        ]);
    })->name('products.low-stock');

    Route::get('products/out-of-stock', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->paginateAdminProducts('out-of-stock'),
            'filter' => 'out-of-stock',
        ]);
    })->name('products.out-of-stock');

    Route::get('products/discontinued', function (AdminService $adminService) {
        return Inertia::render('admin/products/index', [
            'products' => $adminService->paginateAdminProducts('discontinued'),
            'filter' => 'discontinued',
        ]);
    })->name('products.discontinued');

    Route::get('categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('products/create', [AdminProductController::class, 'create'])->name('products.create');
    Route::post('products', [AdminProductController::class, 'store'])->name('products.store');
    Route::get('products/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
    Route::put('products/{product}', [AdminProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');

    Route::get('users/customers', function (AdminService $adminService) {
        return Inertia::render('admin/users/index', [
            'users' => $adminService->paginateAdminCustomers(),
            'role' => 'customer',
        ]);
    })->name('customers.index');

    Route::prefix('sales')->name('sales.')->group(function () {
        Route::get('orders', [SalesController::class, 'orders'])->name('orders.index');
        Route::get('customers', [SalesController::class, 'customers'])->name('customers.index');
        Route::get('customers/{customer}', [SalesController::class, 'customer'])->name('customers.show');
    });
});

require __DIR__.'/settings.php';
