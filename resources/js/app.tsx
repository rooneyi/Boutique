import { createInertiaApp } from '@inertiajs/react';
import { AccountDrawer } from '@/components/storefront/account/account-drawer';
import { AccountDrawerProvider } from '@/components/storefront/account/account-drawer-context';
import { CartDrawer } from '@/components/storefront/cart/cart-drawer';
import { CartDrawerProvider } from '@/components/storefront/cart/cart-drawer-context';
import { FavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer';
import { FavoritesDrawerProvider } from '@/components/storefront/favorites/favorites-drawer-context';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import VendorLayout from '@/layouts/vendor-layout';
import CustomerLayout from '@/layouts/customer-layout';
import SettingsLayout from '@/layouts/settings/layout';
import '@/lib/route'; // Initialize global route function

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

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
            case name === 'customer/orders/show':
            case name === 'customer/contact':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('admin/'):
                return AdminLayout;
            case name.startsWith('vendor/'):
                return VendorLayout;
            case name.startsWith('customer/'):
                return CustomerLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <CartDrawerProvider>
                    <FavoritesDrawerProvider>
                        <AccountDrawerProvider>
                            {app}
                            <CartDrawer />
                            <FavoritesDrawer />
                            <AccountDrawer />
                        </AccountDrawerProvider>
                    </FavoritesDrawerProvider>
                </CartDrawerProvider>
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
