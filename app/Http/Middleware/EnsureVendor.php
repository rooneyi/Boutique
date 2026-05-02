<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureVendor
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check() || auth()->user()->role !== 'VENDOR') {
            return redirect('/')->with('error', 'Accès réservé aux vendeurs');
        }

        return $next($request);
    }
}
