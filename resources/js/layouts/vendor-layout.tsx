import { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, Menu, X, Home, LayoutGrid, UserRound, Mail, LayoutDashboard, Package, ShoppingCart, Users, Store } from 'lucide-react';
import { route } from '@/lib/route';
import { VENDOR_NAV_LINK, VENDOR_SUBNAV_LINK } from '@/lib/vendor-ui-styles';
import { cn } from '@/lib/utils';

const CONTACT_MAIL = 'support@boutique.com';

function NavLink({
    href,
    children,
    active,
}: {
    href: string;
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2')}
            data-active={active ? 'true' : undefined}
        >
            {children}
        </Link>
    );
}

function SubNavLink({
    href,
    children,
    active,
}: {
    href: string;
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={cn(VENDOR_SUBNAV_LINK, 'inline-flex items-center gap-2')}
            data-active={active ? 'true' : undefined}
        >
            {children}
        </Link>
    );
}

export default function VendorLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    const path = url.split('?')[0] ?? '';

    const isDash = path === '/vendor/dashboard' || path === '/vendor';
    const isProducts = path.startsWith('/vendor/products');
    const isOrders = path.startsWith('/vendor/orders');
    const isCustomers = path.startsWith('/vendor/customers');

    const closeMobile = () => setMobileOpen(false);

    return (
        <div className="vendor-ui flex min-h-screen flex-col bg-white font-poppins text-black antialiased">
            <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <Link
                        href={route('vendor.dashboard')}
                        className="font-poppins inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-black"
                        onClick={closeMobile}
                    >
                        <Store className="h-6 w-6 shrink-0" aria-hidden />
                        Ma Boutique
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <NavLink href={route('vendor.dashboard')} active={isDash}>
                            <Home className="h-4 w-4 shrink-0" aria-hidden />
                            Accueil
                        </NavLink>
                        <NavLink href={route('vendor.products.index')} active={isProducts}>
                            <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
                            Collection
                        </NavLink>
                        <NavLink href={route('profile.edit')} active={path.startsWith('/settings')}>
                            <UserRound className="h-4 w-4 shrink-0" aria-hidden />
                            À propos
                        </NavLink>
                        <a href={`mailto:${CONTACT_MAIL}`} className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2')}>
                            <Mail className="h-4 w-4 shrink-0" aria-hidden />
                            Contact
                        </a>
                    </nav>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="font-poppins hidden max-w-[200px] truncate rounded-sm px-3 py-2 text-base font-normal text-black hover:bg-neutral-100 md:inline-flex"
                                >
                                    {auth.user?.name}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="font-poppins">
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        Paramètres
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Déconnexion
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button
                            type="button"
                            className="inline-flex rounded-sm p-2 text-black hover:bg-neutral-100 md:hidden"
                            aria-label="Ouvrir le menu"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="hidden border-t border-neutral-100 bg-neutral-50 md:block">
                    <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-6 px-4 py-3 sm:px-6">
                        <SubNavLink href={route('vendor.dashboard')} active={isDash}>
                            <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                            Tableau de bord
                        </SubNavLink>
                        <SubNavLink href={route('vendor.products.index')} active={isProducts}>
                            <Package className="h-4 w-4 shrink-0" aria-hidden />
                            Produits
                        </SubNavLink>
                        <SubNavLink href={route('vendor.orders.index')} active={isOrders}>
                            <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />
                            Commandes
                        </SubNavLink>
                        <SubNavLink href={route('vendor.customers.index')} active={isCustomers}>
                            <Users className="h-4 w-4 shrink-0" aria-hidden />
                            Clients
                        </SubNavLink>
                    </div>
                </div>
            </header>

            {mobileOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label="Fermer le menu"
                        onClick={closeMobile}
                    />
                    <div className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <span className="font-poppins font-semibold text-black">Menu</span>
                            <button type="button" className="rounded-sm p-2 hover:bg-neutral-100" onClick={closeMobile}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                            <Link
                                href={route('vendor.dashboard')}
                                className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}
                                onClick={closeMobile}
                            >
                                <Home className="h-4 w-4 shrink-0" aria-hidden />
                                Accueil
                            </Link>
                            <Link
                                href={route('vendor.products.index')}
                                className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}
                                onClick={closeMobile}
                            >
                                <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
                                Collection
                            </Link>
                            <Link
                                href={route('profile.edit')}
                                className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}
                                onClick={closeMobile}
                            >
                                <UserRound className="h-4 w-4 shrink-0" aria-hidden />
                                À propos
                            </Link>
                            <a href={`mailto:${CONTACT_MAIL}`} className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}>
                                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                                Contact
                            </a>
                            <div className="my-2 border-t" />
                            <Link
                                href={route('vendor.dashboard')}
                                className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}
                                onClick={closeMobile}
                            >
                                <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
                                Tableau de bord
                            </Link>
                            <Link
                                href={route('vendor.products.index')}
                                className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}
                                onClick={closeMobile}
                            >
                                <Package className="h-4 w-4 shrink-0" aria-hidden />
                                Produits
                            </Link>
                            <Link
                                href={route('vendor.orders.index')}
                                className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}
                                onClick={closeMobile}
                            >
                                <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />
                                Commandes
                            </Link>
                            <Link
                                href={route('vendor.customers.index')}
                                className={cn(VENDOR_NAV_LINK, 'inline-flex items-center gap-2 py-2')}
                                onClick={closeMobile}
                            >
                                <Users className="h-4 w-4 shrink-0" aria-hidden />
                                Clients
                            </Link>
                        </nav>
                        <div className="border-t border-neutral-200 p-4 font-poppins">
                            <p className="truncate text-base font-semibold text-black">{auth.user?.name}</p>
                            <p className="mb-3 truncate text-sm font-normal text-[#747474]">{auth.user?.email}</p>
                            <Link
                                href={route('profile.edit')}
                                className="flex items-center gap-2 py-2 text-base font-normal text-black hover:text-[#0059DD]"
                                onClick={closeMobile}
                            >
                                <Settings className="h-4 w-4 shrink-0" aria-hidden />
                                Paramètres
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                className="flex items-center gap-2 py-2 text-base font-normal text-black hover:text-[#0059DD]"
                                onClick={closeMobile}
                            >
                                <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
            <FlashToaster />
        </div>
    );
}
