<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CreateOrderRequest;
use App\Services\OrderService;
use App\Data\OrderData;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
    ) {}

    public function store(CreateOrderRequest $request)
    {
        $data = OrderData::from($request->validated());
        $order = $this->orderService->createOrder(auth()->user(), $data);

        return response()->json([
            'message' => 'Commande créée avec succès',
            'data' => $order,
        ], 201);
    }

    public function index()
    {
        $orders = $this->orderService->getCustomerOrders(auth()->user());

        return response()->json([
            'data' => $orders,
        ]);
    }

    public function show($orderId)
    {
        $order = auth()->user()->orders()->findOrFail($orderId);
        $details = $this->orderService->getOrderDetails($order);

        return response()->json([
            'data' => $details,
        ]);
    }
}
