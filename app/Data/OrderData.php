<?php

namespace App\Data;

class OrderData
{
    /**
     * @param array<array{product_id: int, quantity: int, price: float}> $items
     */
    public function __construct(
        public int $customer_id,
        public array $items,
        public float $total_amount,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            customer_id: $data['customer_id'],
            items: $data['items'],
            total_amount: (float) $data['total_amount'],
        );
    }

    public function toArray(): array
    {
        return [
            'customer_id' => $this->customer_id,
            'items' => $this->items,
            'total_amount' => $this->total_amount,
        ];
    }
}
