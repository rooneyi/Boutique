<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Product;

class ProductPolicy
{
    public function view(User $user, Product $product): bool
    {
        return $product->vendor_id === $user->id || $user->is_admin;
    }

    public function update(User $user, Product $product): bool
    {
        return $product->vendor_id === $user->id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $product->vendor_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->is_vendor;
    }
}
