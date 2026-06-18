import { usePage } from '@inertiajs/react';
import { Bell, Heart, ShoppingCart } from 'lucide-react';
import { useOptionalAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { useOptionalCartDrawer } from '@/components/storefront/cart/cart-drawer-context';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { useOptionalNotificationsDrawer } from '@/components/storefront/notifications/notifications-drawer-context';
import {
    HeaderIconPill,
    SF_HEADER_ICON_PILL_BELL,
    SF_HEADER_ICON_PILL_CART,
    SF_HEADER_ICON_PILL_HEART,
} from '@/components/storefront/header/header-icon-pill';
import { cn } from '@/lib/utils';

type AuthUser = {
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    cartCount?: number;
    notificationsCount?: number;
    auth?: { user?: AuthUser | null };
};

const ICON_ACTIVE = 'text-white';
const ICON_IDLE = 'text-[#333333]';

export function HeaderIconToolbar() {
    const { url, props } = usePage<PageProps>();
    const { auth, cartCount = 0, notificationsCount = 0 } = props;
    const user = auth?.user;

    const accountDrawer = useOptionalAccountDrawer();
    const cartDrawer = useOptionalCartDrawer();
    const favoritesDrawer = useOptionalFavoritesDrawer();
    const notificationsDrawer = useOptionalNotificationsDrawer();

    const isCustomer = user?.role === 'CUSTOMER';

    const notificationsActive =
        notificationsDrawer?.open ?? url.startsWith('/notifications');
    const favoritesActive =
        (favoritesDrawer?.open ?? false) || url.startsWith('/customer/favorites');
    const cartActive =
        (cartDrawer?.open ?? false) || url.startsWith('/customer/cart');

    function openNotifications() {
        accountDrawer?.closeAccount();
        cartDrawer?.closeCart();
        favoritesDrawer?.closeFavorites();
        notificationsDrawer?.openNotifications();
    }

    function openFavorites() {
        if (!isCustomer) {
            cartDrawer?.closeCart();
            notificationsDrawer?.closeNotifications();
            accountDrawer?.openAccount();
            return;
        }
        accountDrawer?.closeAccount();
        cartDrawer?.closeCart();
        notificationsDrawer?.closeNotifications();
        favoritesDrawer?.openFavorites();
    }

    function openCart() {
        accountDrawer?.closeAccount();
        favoritesDrawer?.closeFavorites();
        notificationsDrawer?.closeNotifications();
        cartDrawer?.openCart();
    }

    return (
        <div className="hidden items-center gap-3 md:flex">
            <HeaderIconPill
                aria-label="Notifications"
                className={cn(SF_HEADER_ICON_PILL_BELL, 'relative')}
                active={notificationsActive}
                onClick={openNotifications}
            >
                <Bell
                    className={cn(
                        'size-5 shrink-0 stroke-[1.75]',
                        notificationsActive ? ICON_ACTIVE : ICON_IDLE,
                    )}
                    aria-hidden
                />
                {notificationsCount > 0 ? (
                    <span
                        className={cn(
                            'absolute -top-1 -right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none',
                            notificationsActive
                                ? 'bg-white text-[#0059DD]'
                                : 'bg-[#0059DD] text-white',
                        )}
                    >
                        {notificationsCount > 99 ? '99+' : notificationsCount}
                    </span>
                ) : null}
            </HeaderIconPill>

            <HeaderIconPill
                aria-label="Mes favoris"
                className={SF_HEADER_ICON_PILL_HEART}
                active={favoritesActive}
                onClick={openFavorites}
            >
                <Heart
                    className={cn(
                        'size-5 shrink-0 stroke-[1.75]',
                        favoritesActive ? ICON_ACTIVE : ICON_IDLE,
                    )}
                    aria-hidden
                />
            </HeaderIconPill>

            <HeaderIconPill
                aria-label="Mon panier"
                className={cn(SF_HEADER_ICON_PILL_CART, 'relative')}
                active={cartActive}
                onClick={openCart}
            >
                <ShoppingCart
                    className={cn(
                        'size-5 shrink-0 stroke-[1.75]',
                        cartActive ? ICON_ACTIVE : ICON_IDLE,
                    )}
                    aria-hidden
                />
                {cartCount > 0 ? (
                    <span className={cn(
                        'absolute -top-1 -right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none',
                        cartActive ? 'bg-white text-[#0059DD]' : 'bg-[#0059DD] text-white',
                    )}>
                        {cartCount > 99 ? '99+' : cartCount}
                    </span>
                ) : null}
            </HeaderIconPill>
        </div>
    );
}
