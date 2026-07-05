import { createInertiaApp } from '@inertiajs/react';
import { AccountDrawer } from '@/components/storefront/account/account-drawer';
import { AccountDrawerProvider } from '@/components/storefront/account/account-drawer-context';
import { CartDrawer } from '@/components/storefront/cart/cart-drawer';
import { CartDrawerProvider } from '@/components/storefront/cart/cart-drawer-context';
import { FavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer';
import { FavoritesDrawerProvider } from '@/components/storefront/favorites/favorites-drawer-context';
import { NotificationsDrawer } from '@/components/storefront/notifications/notifications-drawer';
import { NotificationsDrawerProvider } from '@/components/storefront/notifications/notifications-drawer-context';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import CustomerLayout from '@/layouts/customer-layout';
import {
    storefrontLayout,
    withPageTransition,
    withPageTransitionStack,
} from '@/lib/layout-with-transition';
import SettingsLayout from '@/layouts/settings/layout';
import '@/lib/route'; // Initialize global route function

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/** Pages auth avec maquette split noir / blanc (Figma 19-431). */
const AUTH_SPLIT_PAGES = new Set([
    'auth/login',
    'auth/register-customer',
    'auth/register-customer-birth',
    'auth/forgot-password',
    'auth/forgot-password-verify',
    'auth/forgot-password-phone',
    'auth/reset-password',
    'auth/confirm-password',
]);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'customer/products/index':
            case name === 'customer/products/show':
            case name === 'customer/cart':
            case name === 'customer/favorites/index':
            case name === 'customer/checkout':
            case name === 'customer/account/index':
            case name === 'customer/orders/index':
            case name === 'customer/orders/show':
            case name === 'customer/contact':
            case name === 'customer/about':
            case name === 'customer/delivery':
            case name === 'customer/refund-policy':
            case name === 'customer/profile/edit':
            case name === 'customer/profile/security':
                return storefrontLayout();
            case name.startsWith('auth/'):
                return [
                    withPageTransition(AuthLayout),
                    {
                        variant: AUTH_SPLIT_PAGES.has(name)
                            ? ('split' as const)
                            : ('simple' as const),
                    },
                ];
            case name.startsWith('admin/'):
                return withPageTransition(AdminLayout);
            case name.startsWith('customer/'):
                return withPageTransition(CustomerLayout);
            case name.startsWith('settings/'):
                return withPageTransitionStack(AdminLayout, SettingsLayout);
            default:
                return withPageTransition(AppLayout);
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <CartDrawerProvider>
                    <FavoritesDrawerProvider>
                        <NotificationsDrawerProvider>
                            <AccountDrawerProvider>
                                {app}
                                <CartDrawer />
                                <FavoritesDrawer />
                                <NotificationsDrawer />
                                <AccountDrawer />
                            </AccountDrawerProvider>
                        </NotificationsDrawerProvider>
                    </FavoritesDrawerProvider>
                </CartDrawerProvider>
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#0059DD',
        delay: 80,
        includeCSS: true,
    },
});

// This will set light / dark mode on load...
initializeTheme();
