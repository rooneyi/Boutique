<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCustomer
{
    public function handle(Request $request, Closure $next)
    {
        if (! auth()->check()) {
            return redirect()->guest(route('login'));
        }

        $user = auth()->user();

        return match ($user->role) {
            'VENDOR' => redirect()->route('vendor.dashboard'),
            'ADMIN' => redirect()->route('admin.dashboard'),
            'CUSTOMER' => $next($request),
            default => abort(403),
        };
    }
}
