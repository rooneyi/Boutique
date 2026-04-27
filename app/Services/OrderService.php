<?php

namespace App\Services;

use App\Data\OrderData;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function createOrder(User $customer, OrderData $data): Order
    {
        return DB::transaction(function () use ($customer, $data) {
            // Créer la commande
            $order = Order::create([
                'customer_id' => $customer->id,
                'total_amount' => $data->total_amount,
                'status' => 'pending',
            ]);

            // Attacher les produits et décrémenter le stock
            foreach ($data->items as $item) {
                $product = Product::find($item['product_id']);
                
                // Vérifier le stock disponible
                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("Stock insuffisant pour {$product->name}");
                }

                // Ajouter le produit à la commande
                $order->items()->attach($product->id, [
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                // Décrémenter le stock
                $this->productService->decreaseStock($product, $item['quantity']);
            }

            return $order->load('items');
        });
    }

    public function getCustomerOrders(User $customer)
    {
        return Order::where('customer_id', $customer->id)
            ->with('items')
            ->latest()
            ->paginate(20);
    }

    public function getVendorOrders(User $vendor)
    {
        return Order::whereHas('items', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->with('items')
        ->latest()
        ->paginate(20);
    }

    public function getOrderDetails(Order $order): array
    {
        return [
            'id' => $order->id,
            'customer' => $order->customer,
            'items' => $order->items,
            'total_amount' => $order->total_amount,
            'status' => $order->status,
            'created_at' => $order->created_at,
        ];
    }

    public function updateOrderStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);
        return $order;
    }
}
