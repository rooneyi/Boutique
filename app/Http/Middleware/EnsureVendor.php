<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureVendor
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || !auth()->user()->is_vendor) {
            return response()->json([
                'message' => 'Accès réservé aux vendeurs',
            ], 403);
        }

        return $next($request);
    }
}
