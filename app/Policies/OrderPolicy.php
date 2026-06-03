<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        if ($user->role === 'ADMIN') {
            return true;
        }

        if ($user->role === 'CUSTOMER') {
            return $order->customer->user_id === $user->id;
        }

        return false;
    }

    public function update(User $user, Order $order): bool
    {
        return $user->role === 'ADMIN';
    }

    public function create(User $user): bool
    {
        return $user->role === 'CUSTOMER';
    }
}
