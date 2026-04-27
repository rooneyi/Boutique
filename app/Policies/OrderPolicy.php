<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Order;

class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return $order->customer_id === $user->id || $user->is_admin;
    }

    public function create(User $user): bool
    {
        return !$user->is_vendor;
    }
}
