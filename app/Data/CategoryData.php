<?php

namespace App\Data;

class CategoryData
{
    public function __construct(
        public string $name,
        public ?int $id = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name: $data['name'],
            id: $data['id'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
        ];
    }
}