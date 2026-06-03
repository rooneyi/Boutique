<?php

namespace App\Support;

use App\Models\User;
use App\Models\Vendor;

/**
 * Boutique mono-vendeur : l'admin gère le catalogue via un enregistrement Vendor « PCJ ».
 */
final class BoutiqueStore
{
    public static function vendor(): Vendor
    {
        static $vendor = null;

        if ($vendor !== null) {
            return $vendor;
        }

        $admin = User::query()->where('role', 'ADMIN')->orderBy('id')->first();

        if ($admin === null) {
            throw new \RuntimeException('Aucun compte administrateur pour rattacher la boutique PCJ.');
        }

        $vendor = Vendor::query()->firstOrCreate(
            ['user_id' => $admin->id],
            ['shop_name' => 'PCJ'],
        );

        return $vendor;
    }
}
