import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import type {
    NotificationsPreview,
    StoreNotificationItem,
} from '@/components/storefront/notifications/notifications-types';
import { route } from '@/lib/route';
import { getStorefrontAuthUser } from '@/lib/storefront-page-props';

type NotificationsDrawerContextValue = {
    open: boolean;
    notifications: StoreNotificationItem[];
    unreadCount: number;
    loading: boolean;
    openNotifications: () => void;
    closeNotifications: () => void;
    openNotification: (item: StoreNotificationItem) => void;
    refresh: () => Promise<void>;
};

const NotificationsDrawerContext =
    createContext<NotificationsDrawerContextValue | null>(null);

function getCsrfToken(): string {
    return (
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''
    );
}

export function NotificationsDrawerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<StoreNotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const applyPreview = useCallback((data: NotificationsPreview) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(route('customer.notifications.preview'), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (!response.ok) {
                toast.error('Impossible de charger les notifications.');
                return;
            }

            const data = (await response.json()) as NotificationsPreview;
            applyPreview(data);
        } catch {
            toast.error('Impossible de charger les notifications.');
        } finally {
            setLoading(false);
        }
    }, [applyPreview]);

    const markAllRead = useCallback(async () => {
        const user = getStorefrontAuthUser();
        if (user?.role !== 'CUSTOMER') {
            return;
        }

        try {
            await fetch(route('customer.notifications.read-all'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
            });
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
            router.reload({ only: ['notificationsCount'] });
        } catch {
            // Non bloquant : le tiroir reste utilisable.
        }
    }, []);

    const openNotifications = useCallback(() => {
        setOpen(true);
        void refresh().then(() => {
            void markAllRead();
        });
    }, [refresh, markAllRead]);

    const closeNotifications = useCallback(() => {
        setOpen(false);
    }, []);

    const openNotification = useCallback(
        (item: StoreNotificationItem) => {
            if (item.product) {
                router.visit(route('customer.products.show', { product: item.product.id }));
            }
            closeNotifications();
        },
        [closeNotifications],
    );

    const value = useMemo(
        () => ({
            open,
            notifications,
            unreadCount,
            loading,
            openNotifications,
            closeNotifications,
            openNotification,
            refresh,
        }),
        [
            open,
            notifications,
            unreadCount,
            loading,
            openNotifications,
            closeNotifications,
            openNotification,
            refresh,
        ],
    );

    return (
        <NotificationsDrawerContext.Provider value={value}>
            {children}
        </NotificationsDrawerContext.Provider>
    );
}

export function useNotificationsDrawer(): NotificationsDrawerContextValue {
    const ctx = useContext(NotificationsDrawerContext);
    if (!ctx) {
        throw new Error(
            'useNotificationsDrawer must be used within NotificationsDrawerProvider',
        );
    }

    return ctx;
}

export function useOptionalNotificationsDrawer(): NotificationsDrawerContextValue | null {
    return useContext(NotificationsDrawerContext);
}
