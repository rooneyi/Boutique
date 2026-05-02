<?php

namespace App\Services;

use App\Data\OrderData;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function createOrder(Customer $customer, OrderData $data): Order
    {
        return DB::transaction(function () use ($customer, $data) {
            // Créer la commande
            $order = Order::create([
                'customer_id' => $customer->id,
                'vendor_id' => $data->vendor_id,
                'total' => $data->total,
                'status' => $data->status,
            ]);

            // Créer les items de commande et décrémenter le stock
            foreach ($data->items as $item) {
                $product = Product::find($item['product_id']);
                
                // Vérifier le stock disponible
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stock insuffisant pour {$product->name}");
                }

                // Créer l'item de commande
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                // Décrémenter le stock
                $this->productService->decreaseStock($product, $item['quantity']);
            }

            return $order->load('items');
        });
    }

    public function getCustomerOrders(Customer $customer)
    {
        return Order::where('customer_id', $customer->id)
            ->with(['items.product'])
            ->latest()
            ->paginate(20);
    }

    public function getVendorOrders(Vendor $vendor)
    {
        return Order::where('vendor_id', $vendor->id)
            ->with(['items.product', 'customer.user'])
            ->latest()
            ->paginate(20);
    }

    public function getOrderDetails(Order $order): array
    {
        return [
            'id' => $order->id,
            'customer' => $order->customer,
            'vendor' => $order->vendor,
            'items' => $order->items,
            'total' => $order->total,
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
