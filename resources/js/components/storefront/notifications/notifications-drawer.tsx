import { Loader2, Package, X } from 'lucide-react';
import { useNotificationsDrawer } from '@/components/storefront/notifications/notifications-drawer-context';
import type { StoreNotificationItem } from '@/components/storefront/notifications/notifications-types';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

function formatWhen(iso: string | null): string {
    if (!iso) {
        return '';
    }
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
        return "À l'instant";
    }
    if (diffHours < 24) {
        return `Il y a ${diffHours} h`;
    }

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
    });
}

function NotificationRow({
    item,
    onOpen,
}: {
    item: StoreNotificationItem;
    onOpen: (item: StoreNotificationItem) => void;
}) {
    const product = item.product;

    return (
        <button
            type="button"
            onClick={() => onOpen(item)}
            className={cn(
                'flex w-full gap-3 rounded-xl border border-neutral-100 p-3 text-left transition-colors hover:bg-neutral-50',
                !item.read && 'bg-[#0059DD]/[0.04]',
            )}
        >
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {product?.image_path ? (
                    <img
                        src={product.image_path}
                        alt=""
                        className="size-full object-cover"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-neutral-400">
                        <Package className="size-6" strokeWidth={1.5} aria-hidden />
                    </div>
                )}
                {!item.read ? (
                    <span className="absolute top-1 right-1 size-2 rounded-full bg-[#0059DD]" />
                ) : null}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <p className="font-poppins text-sm font-semibold text-black">
                        {item.title}
                    </p>
                    <span className="shrink-0 font-poppins text-[11px] text-[#737373]">
                        {formatWhen(item.created_at)}
                    </span>
                </div>
                <p className="mt-0.5 line-clamp-2 font-poppins text-xs leading-relaxed text-[#555]">
                    {item.message}
                </p>
                {product ? (
                    <p className="mt-1.5 font-poppins text-xs font-medium text-[#0059DD]">
                        {product.price.toFixed(2)} $ · Voir le produit
                    </p>
                ) : null}
            </div>
        </button>
    );
}

export function NotificationsDrawer() {
    const {
        open,
        closeNotifications,
        notifications,
        loading,
        openNotification,
    } = useNotificationsDrawer();

    const isEmpty = !loading && notifications.length === 0;

    return (
        <Sheet open={open} onOpenChange={(next) => !next && closeNotifications()}>
            <SheetContent
                side="right"
                size="default"
                showCloseButton={false}
                className="flex w-full max-w-[min(100vw,400px)] flex-col gap-0 overflow-hidden border-l border-neutral-100 bg-white p-0 sm:max-w-[400px]"
                overlayClassName="bg-black/50 backdrop-blur-[1px]"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-4">
                    <SheetTitle className="font-poppins text-xl font-semibold text-black">
                        Notifications
                    </SheetTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full text-black hover:bg-neutral-100"
                        onClick={closeNotifications}
                        aria-label="Fermer les notifications"
                    >
                        <X className="size-5" strokeWidth={1.5} />
                    </Button>
                </div>

                <SheetDescription className="sr-only">
                    Nouveautés et mises à jour PCJ
                </SheetDescription>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
                    {loading && notifications.length === 0 ? (
                        <div className="flex items-center justify-center py-16 text-[#737373]">
                            <Loader2 className="size-7 animate-spin" aria-hidden />
                            <span className="sr-only">Chargement</span>
                        </div>
                    ) : isEmpty ? (
                        <div className="flex flex-col items-center px-2 py-12 text-center">
                            <p className="font-poppins text-base font-medium text-black">
                                Aucune notification
                            </p>
                            <p className="mt-2 font-poppins text-sm text-[#737373]">
                                Les nouveaux produits et actualités PCJ apparaîtront ici.
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {notifications.map((item) => (
                                <li key={item.id}>
                                    <NotificationRow item={item} onOpen={openNotification} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
