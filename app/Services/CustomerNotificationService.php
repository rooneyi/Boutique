<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\CustomerNotificationRead;
use App\Models\Product;
use App\Models\StoreNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class CustomerNotificationService
{
    public function notifyNewProduct(Product $product): StoreNotification
    {
        return StoreNotification::query()->create([
            'type' => 'new_product',
            'product_id' => $product->id,
            'title' => 'Nouveau produit',
            'message' => sprintf('Découvrez « %s » dans notre collection.', $product->name),
        ]);
    }

    public function unreadCountFor(?Customer $customer): int
    {
        $query = StoreNotification::query()
            ->where('type', 'new_product')
            ->whereHas('product', fn ($q) => $q->where('status', '!=', 'DISCONTINUED'));

        if ($customer === null) {
            return (int) $query
                ->where('created_at', '>=', now()->subDays(30))
                ->count();
        }

        return (int) $query
            ->whereDoesntHave('reads', fn ($q) => $q->where('customer_id', $customer->id))
            ->count();
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function previewFor(?Customer $customer, int $limit = 20): Collection
    {
        $readIds = $customer
            ? CustomerNotificationRead::query()
                ->where('customer_id', $customer->id)
                ->pluck('store_notification_id')
            : collect();

        return StoreNotification::query()
            ->with(['product.category'])
            ->where('type', 'new_product')
            ->whereHas('product', fn ($q) => $q->where('status', '!=', 'DISCONTINUED'))
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (StoreNotification $notification) => $this->payload($notification, $readIds->contains($notification->id)));
    }

    public function markRead(Customer $customer, StoreNotification $notification): void
    {
        CustomerNotificationRead::query()->updateOrCreate(
            [
                'customer_id' => $customer->id,
                'store_notification_id' => $notification->id,
            ],
            ['read_at' => now()],
        );
    }

    public function markAllRead(Customer $customer): void
    {
        $unreadIds = StoreNotification::query()
            ->where('type', 'new_product')
            ->whereDoesntHave('reads', fn ($q) => $q->where('customer_id', $customer->id))
            ->pluck('id');

        if ($unreadIds->isEmpty()) {
            return;
        }

        $now = now();
        $rows = $unreadIds->map(fn (int $id) => [
            'customer_id' => $customer->id,
            'store_notification_id' => $id,
            'read_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        CustomerNotificationRead::query()->insert($rows);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(StoreNotification $notification, bool $read): array
    {
        $product = $notification->product;

        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'title' => $notification->title,
            'message' => $notification->message,
            'read' => $read,
            'created_at' => $notification->created_at?->toIso8601String(),
            'product' => $product ? [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'category' => $product->category?->name ?? '',
                'image_path' => $product->image
                    ? Storage::disk('public')->url($product->image)
                    : null,
            ] : null,
        ];
    }
}
