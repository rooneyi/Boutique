<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureVendor
{
    public function handle(Request $request, Closure $next)
    {
        if (! auth()->check()) {
            return redirect()->guest(route('login'));
        }

        $user = auth()->user();

        return match ($user->role) {
            'CUSTOMER' => redirect()->route('home'),
            'ADMIN' => redirect()->route('admin.dashboard'),
            'VENDOR' => $next($request),
            default => abort(403),
        };
    }
}
