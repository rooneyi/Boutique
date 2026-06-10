import { useCallback } from 'react';
import { useOptionalCartDrawer } from '@/components/storefront/cart/cart-drawer-context';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { useOptionalNotificationsDrawer } from '@/components/storefront/notifications/notifications-drawer-context';

export function useHeaderIconPanels() {
    const cartDrawer = useOptionalCartDrawer();
    const favoritesDrawer = useOptionalFavoritesDrawer();
    const notificationsDrawer = useOptionalNotificationsDrawer();

    const openCart = useCallback(() => {
        favoritesDrawer?.closeFavorites();
        notificationsDrawer?.closeNotifications();
        cartDrawer?.openCart();
    }, [cartDrawer, favoritesDrawer, notificationsDrawer]);

    const openFavorites = useCallback(() => {
        cartDrawer?.closeCart();
        notificationsDrawer?.closeNotifications();
        favoritesDrawer?.openFavorites();
    }, [cartDrawer, favoritesDrawer, notificationsDrawer]);

    const openNotifications = useCallback(() => {
        cartDrawer?.closeCart();
        favoritesDrawer?.closeFavorites();
        notificationsDrawer?.openNotifications();
    }, [cartDrawer, favoritesDrawer, notificationsDrawer]);

    return {
        cartActive: cartDrawer?.open ?? false,
        favoritesActive: favoritesDrawer?.open ?? false,
        notificationsActive: notificationsDrawer?.open ?? false,
        openCart,
        openFavorites,
        openNotifications,
    };
}
