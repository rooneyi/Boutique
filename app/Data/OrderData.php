<?php

namespace App\Data;

class OrderData
{
    /**
     * @param array<array{product_id: int, quantity: int, price: float}> $items
     */
    public function __construct(
        public int $customer_id,
        public int $vendor_id,
        public array $items,
        public float $total,
        public ?string $status = 'PENDING',
    ) {}

    public static function from(array $data): self
    {
        return new self(
            customer_id: $data['customer_id'],
            vendor_id: $data['vendor_id'],
            items: $data['items'],
            total: (float) $data['total'],
            status: $data['status'] ?? 'PENDING',
        );
    }

    public function toArray(): array
    {
        return [
            'customer_id' => $this->customer_id,
            'vendor_id' => $this->vendor_id,
            'items' => $this->items,
            'total' => $this->total,
            'status' => $this->status,
        ];
    }
}
