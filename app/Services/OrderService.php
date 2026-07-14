<?php

namespace App\Services;

use App\Data\OrderData;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
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
                'delivery_method' => $data->delivery_method,
                'shipping_full_name' => $data->shipping_full_name,
                'shipping_whatsapp' => $data->shipping_whatsapp,
                'shipping_address' => $data->shipping_address,
                'shipping_city' => $data->shipping_city,
                'shipping_district' => $data->shipping_district,
                'payment_method' => $data->payment_method,
                'customer_note' => $data->customer_note,
            ]);

            // Créer les items de commande et décrémenter le stock
            foreach ($data->items as $item) {
                $product = Product::find($item['product_id']);
                $variantId = isset($item['variant_id']) ? (int) $item['variant_id'] : null;
                $variant = $variantId
                    ? ProductVariant::query()->where('product_id', $product->id)->find($variantId)
                    : null;

                if ($variant) {
                    if ($variant->stock < $item['quantity']) {
                        throw new \Exception("Stock insuffisant pour {$product->name}");
                    }
                } elseif ($product->stock < $item['quantity']) {
                    throw new \Exception("Stock insuffisant pour {$product->name}");
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'variant_id' => $variant?->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                $this->productService->decreaseStock($product, $item['quantity'], $variant?->id);
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
