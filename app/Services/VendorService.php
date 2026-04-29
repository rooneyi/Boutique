<?php

namespace App\Services;

use App\Data\VendorRegisterData;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;

class VendorService
{
    public function register(VendorRegisterData $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data->name,
                'email' => $data->email,
                'password' => bcrypt($data->password),
                'role' => 'VENDOR',
            ]);

            Vendor::create([
                'user_id' => $user->id,
                'shop_name' => $data->shop_name,
            ]);

            return $user;
        });
    }

    public function updateProfile(Vendor $vendor, array $data): Vendor
    {
        $vendor->update($data);
        return $vendor;
    }

    public function getVendorStats(Vendor $vendor): array
    {
        return [
            'total_sales' => $vendor->orders()->sum('total'),
            'total_orders' => $vendor->orders()->count(),
            'total_products' => $vendor->products()->count(),
            'low_stock_products' => $vendor->products()->where('stock', '<', 10)->count(),
        ];
    }
}
