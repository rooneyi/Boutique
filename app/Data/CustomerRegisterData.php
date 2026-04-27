<?php

namespace App\Data;

class CustomerRegisterData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => bcrypt($this->password),
        ];
    }
}
