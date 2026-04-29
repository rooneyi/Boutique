<?php

namespace App\Services;

use App\Data\CustomerRegisterData;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function register(CustomerRegisterData $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => bcrypt($data->password),
                'role' => 'CUSTOMER',
            ]);

            Customer::create([
                'user_id' => $user->id,
            ]);

            return $user;
        });
    }

    public function getCustomerStats(Customer $customer): array
    {
        return [
            'total_orders' => $customer->orders()->count(),
            'total_spent' => $customer->orders()->sum('total'),
            'average_order_value' => $customer->orders()->avg('total') ?? 0,
        ];
    }

    public function getCustomerHistory(Customer $customer)
    {
        return $customer->orders()->with('items.product')->latest()->paginate(20);
    }
}
