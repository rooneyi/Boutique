import { Link, router } from '@inertiajs/react';
import {
    Bell,
    Globe,
    Heart,
    Instagram,
    Search,
    ShoppingCart,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InertiaPropsSync } from '@/components/storefront/inertia-props-sync';
import { useOptionalAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { useOptionalCartDrawer } from '@/components/storefront/cart/cart-drawer-context';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_NAV_ITEM, SF_NAV_ITEM_ACTIVE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type ActiveNav = 'home' | 'collection';

type Props = {
    user?: AuthUser | null;
    canRegister: boolean;
    activeNav?: ActiveNav;
};

const NAV_ITEMS = [
    { key: 'home' as const, label: 'Accueil', href: route('home') },
    {
        key: 'collection' as const,
        label: 'Collection',
        href: route('customer.products.index'),
    },
    { key: 'about' as const, label: 'A Propos', href: `${route('home')}#pourquoi-nous` },
    { key: 'contact' as const, label: 'Contact', href: 'mailto:kambmusene@gmail.com' },
];

export function HomeHeader({ user, canRegister, activeNav = 'home' }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const cartDrawer = useOptionalCartDrawer();
    const favoritesDrawer = useOptionalFavoritesDrawer();
    const accountDrawer = useOptionalAccountDrawer();

    function openAccount() {
        if (user?.role === 'CUSTOMER') {
            accountDrawer?.openAccount();
        } else {
            router.visit(route('login'));
        }
    }

    const accountHref =
        user?.role === 'ADMIN'
            ? '/admin/dashboard'
            : user?.role === 'VENDOR'
              ? '/vendor/dashboard'
              : user?.role === 'CUSTOMER'
                ? route('customer.products.index')
                : route('login');

    return (
        <>
            <InertiaPropsSync />
            <header className="sticky top-0 z-50">
            <div className="bg-black text-white">
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-[102px]">
                    <div className="flex items-center gap-3">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-white/90 transition-colors hover:text-white"
                            aria-label="Instagram"
                        >
                            <Instagram className="size-7" strokeWidth={1.5} />
                        </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        {canRegister && !user && (
                            <Link
                                href={route('auth.customer.register')}
                                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                            >
                                <User className="size-5" strokeWidth={1.5} />
                                <span className="font-poppins font-normal">
                                    Rejoignez-nous
                                </span>
                            </Link>
                        )}
                        <div className="flex items-center gap-2 text-white/90">
                            <Globe className="size-5" strokeWidth={1.5} />
                            <span className="font-poppins font-normal">
                                Lubumbashi
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-[100px]">
                    <Link href={route('home')} className="shrink-0">
                        <img
                            src={HOME_ASSETS.logo}
                            alt="PCJ"
                            className="h-12 w-12 object-contain"
                        />
                    </Link>

                    <nav className="hidden items-center gap-1 lg:flex">
                        {NAV_ITEMS.map((item) => {
                            const isActive = item.key === activeNav;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={
                                        isActive ? SF_NAV_ITEM_ACTIVE : SF_NAV_ITEM
                                    }
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="mt-0.5 size-1.5 rounded-full bg-[#0059DD]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden min-w-[200px] items-center gap-3 border-b border-[#bfbfbf] pb-2 md:flex lg:min-w-[280px]">
                            <Search className="size-5 shrink-0 text-[#999]" />
                            <input
                                type="search"
                                readOnly
                                placeholder="Que recherchez-vous ?"
                                className="font-poppins w-full border-0 bg-transparent text-base text-black placeholder:text-[#999] focus:outline-none"
                            />
                        </div>
                        {user?.role === 'CUSTOMER' ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hidden rounded-full text-black lg:inline-flex"
                                onClick={openAccount}
                                aria-label="Mon compte"
                            >
                                <User className="size-6" strokeWidth={1.25} />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hidden rounded-full text-black lg:inline-flex"
                                asChild
                            >
                                <Link href={accountHref} aria-label="Notifications">
                                    <Bell className="size-6" strokeWidth={1.25} />
                                </Link>
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-black"
                            onClick={() => {
                                if (user?.role === 'CUSTOMER') {
                                    favoritesDrawer?.openFavorites();
                                } else {
                                    router.visit(route('login'));
                                }
                            }}
                            aria-label="Favoris"
                        >
                            <Heart className="size-6" strokeWidth={1.25} />
                        </Button>
                        {user?.role === 'CUSTOMER' && (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="rounded-full border-[#bfbfbf]"
                                onClick={() => cartDrawer?.openCart()}
                                aria-label="Panier"
                            >
                                <ShoppingCart className="size-5" />
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="font-poppins lg:hidden"
                            onClick={() => setMobileOpen((o) => !o)}
                        >
                            Menu
                        </Button>
                    </div>
                </div>

                {mobileOpen && (
                    <nav className="border-t border-neutral-100 bg-white px-4 py-4 lg:hidden">
                        {NAV_ITEMS.map((item) => {
                            const isActive = item.key === activeNav;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={cn(
                                        'font-poppins block py-2 text-base',
                                        isActive && 'font-semibold text-[#0059DD]',
                                    )}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        {user?.role === 'CUSTOMER' && (
                            <button
                                type="button"
                                className="font-poppins block w-full py-2 text-left text-base"
                                onClick={() => {
                                    setMobileOpen(false);
                                    favoritesDrawer?.openFavorites();
                                }}
                            >
                                Mes favoris
                            </button>
                        )}
                        {user?.role === 'CUSTOMER' ? (
                            <button
                                type="button"
                                className="font-poppins mt-2 block w-full py-2 text-left text-base"
                                onClick={() => {
                                    setMobileOpen(false);
                                    openAccount();
                                }}
                            >
                                Mon compte
                            </button>
                        ) : (
                            <Link
                                href={accountHref}
                                className="font-poppins mt-2 block py-2 text-base"
                                onClick={() => setMobileOpen(false)}
                            >
                                {user ? 'Mon compte' : 'Connexion'}
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </header>
        </>
    );
}

