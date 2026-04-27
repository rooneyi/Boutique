<?php

namespace App\Data;

class ProductData
{
    public function __construct(
        public string $name,
        public string $description,
        public float $price,
        public int $quantity,
        public ?string $image_path = null,
        public ?string $category = null,
        public ?int $id = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['description'],
            price: (float) $data['price'],
            quantity: (int) $data['quantity'],
            image_path: $data['image_path'] ?? null,
            category: $data['category'] ?? null,
            id: $data['id'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'image_path' => $this->image_path,
            'category' => $this->category,
        ];
    }
}
