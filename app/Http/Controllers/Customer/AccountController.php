<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
class AccountController extends Controller
{
    public function preview(): JsonResponse
    {
        $user = auth()->user();
        $customer = $user?->customer;

        if ($user === null || $user->role !== 'CUSTOMER' || $customer === null) {
            abort(403, 'Accès réservé aux clients.');
        }

        return response()->json([
            'name' => $user->name,
            'phone' => $this->formatPhonePlaceholder($user->email),
            'email' => $user->email,
            'avatar_url' => null,
            'orders_count' => (int) $customer->orders()->count(),
            'tokens_count' => 0,
            'initials' => $this->initials($user->name),
        ]);
    }

    private function formatPhonePlaceholder(string $email): string
    {
        return $email;
    }

    private function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        return strtoupper(
            collect($parts)
                ->take(2)
                ->map(fn (string $part) => mb_substr($part, 0, 1))
                ->join('')
        ) ?: '?';
    }
}
