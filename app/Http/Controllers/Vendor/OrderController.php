<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
    ) {}

    public function index()
    {
        $orders = $this->orderService->getVendorOrders(auth()->user()->vendor);

        return response()->json([
            'data' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $details = $this->orderService->getOrderDetails($order);

        return response()->json([
            'data' => $details,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $request->validate([
            'status' => 'required|in:PENDING,PAID,CANCELLED',
        ]);

        $order = $this->orderService->updateOrderStatus($order, $request->status);

        return response()->json([
            'message' => 'Statut de la commande mis à jour',
            'data' => $order,
        ]);
    }
}
