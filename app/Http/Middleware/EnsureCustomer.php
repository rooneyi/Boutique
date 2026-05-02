<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCustomer
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || auth()->user()->role !== 'CUSTOMER') {
            return redirect('/')->with('error', 'Accès réservé aux clients');
        }

        return $next($request);
    }
}
