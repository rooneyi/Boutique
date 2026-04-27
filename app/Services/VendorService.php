<?php

namespace App\Services;

use App\Data\VendorRegisterData;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class VendorService
{
    public function register(VendorRegisterData $data): User
    {
        return DB::transaction(function () use ($data) {
            $vendor = User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => bcrypt($data->password),
                'is_vendor' => true,
                'shop_name' => $data->shop_name,
            ]);

            return $vendor;
        });
    }

    public function updateProfile(User $vendor, array $data): User
    {
        $vendor->update($data);
        return $vendor;
    }

    public function getVendorStats(User $vendor): array
    {
        return [
            'total_sales' => $vendor->orders()->sum('total_amount'),
            'total_orders' => $vendor->orders()->count(),
            'total_products' => $vendor->products()->count(),
            'low_stock_products' => $vendor->products()->where('quantity', '<', 10)->count(),
        ];
    }
}
