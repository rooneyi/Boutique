<?php

namespace App\Data;

class ProductData
{
    public function __construct(
        public string $name,
        public ?string $description,
        public float $price,
        public int $stock,
        public ?string $image = null,
        public ?int $category_id = null,
        public ?string $status = 'IN_STOCK',
        public ?int $id = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            name: $data['name'],
            description: $data['description'] ?? null,
            price: (float) $data['price'],
            stock: (int) $data['stock'],
            image: $data['image'] ?? null,
            category_id: $data['category_id'] ?? null,
            status: $data['status'] ?? 'IN_STOCK',
            id: $data['id'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description ?? '',
            'price' => $this->price,
            'stock' => $this->stock,
            'image' => $this->image,
            'category_id' => $this->category_id,
            'status' => $this->status,
        ];
    }
}
