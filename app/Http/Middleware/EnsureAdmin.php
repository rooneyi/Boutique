<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (! auth()->check()) {
            return redirect()->guest(route('login'));
        }

        $user = auth()->user();

        return match ($user->role) {
            'CUSTOMER' => redirect()->route('home'),
            'VENDOR' => redirect()->route('vendor.dashboard'),
            'ADMIN' => $next($request),
            default => abort(403),
        };
    }
}
