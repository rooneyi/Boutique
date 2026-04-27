<?php

namespace App\Http\Responses;

use Illuminate\Http\RedirectResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): RedirectResponse
    {
        $user = $request->user();

        if ($user?->is_admin) {
            return redirect()->intended('/admin/dashboard');
        }

        if ($user?->is_vendor) {
            return redirect()->intended('/vendor/dashboard');
        }

        return redirect()->intended('/customer/products');
    }
}
