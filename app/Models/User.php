<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'is_vendor', 'is_admin', 'shop_name'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_vendor' => 'boolean',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Relations pour les VENDEURS
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'vendor_id');
    }

    public function shop(): HasOne
    {
        return $this->hasOne(Shop::class, 'vendor_id');
    }

    /**
     * Relations pour les CLIENTS
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    /**
     * Vérifier le type d'utilisateur
     */
    public function isVendor(): bool
    {
        return $this->is_vendor;
    }

    public function isCustomer(): bool
    {
        return !$this->is_vendor;
    }

    public function isAdmin(): bool
    {
        return $this->is_admin;
    }
}
