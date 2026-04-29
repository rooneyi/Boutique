<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCustomer
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || auth()->user()->role !== 'CUSTOMER') {
            return response()->json([
                'message' => 'Accès réservé aux clients',
            ], 403);
        }

        return $next($request);
    }
}
