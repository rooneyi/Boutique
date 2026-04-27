<?php

namespace App\Data;

class VendorRegisterData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $shop_name,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            shop_name: $data['shop_name'],
        );
    }
}
