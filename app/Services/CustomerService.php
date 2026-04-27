<?php

namespace App\Services;

use App\Data\CustomerRegisterData;
use App\Models\User;

class CustomerService
{
    public function register(CustomerRegisterData $data): User
    {
        return User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => bcrypt($data->password),
            'is_vendor' => false,
        ]);
    }

    public function getCustomerStats(User $customer): array
    {
        return [
            'total_orders' => $customer->orders()->count(),
            'total_spent' => $customer->orders()->sum('total_amount'),
            'average_order_value' => $customer->orders()->avg('total_amount') ?? 0,
        ];
    }

    public function getCustomerHistory(User $customer)
    {
        return $customer->orders()->with('items')->latest()->paginate(20);
    }
}
