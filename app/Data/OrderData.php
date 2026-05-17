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
        public ?string $shipping_full_name = null,
        public ?string $shipping_whatsapp = null,
        public ?string $shipping_address = null,
        public ?string $shipping_city = null,
        public ?string $shipping_district = null,
        public ?string $payment_method = null,
        public ?string $customer_note = null,
    ) {}

    public static function from(array $data): self
    {
        return new self(
            customer_id: $data['customer_id'],
            vendor_id: $data['vendor_id'],
            items: $data['items'],
            total: (float) $data['total'],
            status: $data['status'] ?? 'PENDING',
            shipping_full_name: $data['shipping_full_name'] ?? null,
            shipping_whatsapp: $data['shipping_whatsapp'] ?? null,
            shipping_address: $data['shipping_address'] ?? null,
            shipping_city: $data['shipping_city'] ?? null,
            shipping_district: $data['shipping_district'] ?? null,
            payment_method: $data['payment_method'] ?? null,
            customer_note: $data['customer_note'] ?? null,
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
