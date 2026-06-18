<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\StoreNotification;
use App\Services\CustomerNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        private CustomerNotificationService $notifications,
    ) {}

    public function preview(Request $request): JsonResponse
    {
        $customer = $request->user()?->customer;
        $items = $this->notifications->previewFor($customer);

        return response()->json([
            'notifications' => $items->values()->all(),
            'unread_count' => $this->notifications->unreadCountFor($customer),
        ]);
    }

    public function markRead(Request $request, StoreNotification $notification): JsonResponse
    {
        $customer = $request->user()?->customer;
        if ($customer === null) {
            abort(403);
        }

        $this->notifications->markRead($customer, $notification);

        return response()->json([
            'unread_count' => $this->notifications->unreadCountFor($customer),
        ]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $customer = $request->user()?->customer;
        if ($customer === null) {
            abort(403);
        }

        $this->notifications->markAllRead($customer);

        return response()->json([
            'unread_count' => 0,
        ]);
    }
}
