export type NotificationProduct = {
    id: number;
    name: string;
    price: number;
    category: string;
    image_path: string | null;
};

export type StoreNotificationItem = {
    id: number;
    type: 'new_product' | string;
    title: string;
    message: string | null;
    read: boolean;
    created_at: string | null;
    product: NotificationProduct | null;
};

export type NotificationsPreview = {
    notifications: StoreNotificationItem[];
    unread_count: number;
};
