<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || auth()->user()->role !== 'ADMIN') {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Accès réservé aux administrateurs',
                ], 403);
            }

            abort(403, 'Accès réservé aux administrateurs');
        }

        return $next($request);
    }
}
