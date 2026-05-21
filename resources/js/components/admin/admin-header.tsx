import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Globe,
    Instagram,
    LayoutDashboard,
    LogOut,
    Menu,
    Package,
    Settings,
    ShoppingBag,
    Store,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StorefrontLogo } from '@/components/storefront/storefront-logo';
import {
    ADMIN_NAV_ITEM,
    ADMIN_NAV_ITEM_ACTIVE,
    ADMIN_SHELL_MAX,
    ADMIN_SUBNAV_LINK,
} from '@/lib/admin-ui-styles';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type NavItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    match: (path: string) => boolean;
};

const MAIN_NAV: NavItem[] = [
    {
        label: 'Tableau de bord',
        href: route('admin.dashboard'),
        icon: LayoutDashboard,
        match: (path) => path === '/admin/dashboard',
    },
    {
        label: 'Analyse',
        href: route('admin.analytics.sales'),
        icon: BarChart3,
        match: (path) => path.startsWith('/admin/analytics'),
    },
    {
        label: 'Produits',
        href: route('admin.products.index'),
        icon: Package,
        match: (path) => path.startsWith('/admin/products'),
    },
    {
        label: 'Vendeurs',
        href: route('admin.vendors.index'),
        icon: Store,
        match: (path) => path.startsWith('/admin/users/vendors'),
    },
    {
        label: 'Clients',
        href: route('admin.customers.index'),
        icon: Users,
        match: (path) => path.startsWith('/admin/users/customers'),
    },
];

const STOCK_NAV: NavItem[] = [
    {
        label: 'Tous',
        href: route('admin.products.index'),
        icon: Package,
        match: (path) => path === '/admin/products',
    },
    {
        label: 'En stock',
        href: route('admin.products.in-stock'),
        icon: ShoppingBag,
        match: (path) => path.endsWith('/in-stock'),
    },
    {
        label: 'Faibles stocks',
        href: route('admin.products.low-stock'),
        icon: ShoppingBag,
        match: (path) => path.endsWith('/low-stock'),
    },
    {
        label: 'Ruptures',
        href: route('admin.products.out-of-stock'),
        icon: ShoppingBag,
        match: (path) => path.endsWith('/out-of-stock'),
    },
    {
        label: 'Terminés',
        href: route('admin.products.discontinued'),
        icon: ShoppingBag,
        match: (path) => path.endsWith('/discontinued'),
    },
];

function MainNavLink({ item, path }: { item: NavItem; path: string }) {
    const active = item.match(path);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            className={cn(
                active ? ADMIN_NAV_ITEM_ACTIVE : ADMIN_NAV_ITEM,
                'inline-flex flex-col items-center px-4',
            )}
        >
            <span className="inline-flex items-center gap-2">
                <Icon className="size-4 shrink-0 lg:hidden" strokeWidth={1.25} />
                {item.label}
            </span>
            {active && (
                <span className="mt-0.5 size-1.5 rounded-full bg-[#0059DD]" aria-hidden />
            )}
        </Link>
    );
}

function SubNavLink({ item, path }: { item: NavItem; path: string }) {
    const active = item.match(path);

    return (
        <Link
            href={item.href}
            className={ADMIN_SUBNAV_LINK}
            data-active={active ? 'true' : undefined}
        >
            {item.label}
        </Link>
    );
}

export function AdminHeader() {
    const page = usePage();
    const auth = page.props.auth as { user?: { name?: string; email?: string } };
    const path = page.url.split('?')[0] ?? '';
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = () => setMobileOpen(false);
    const showStockSubnav = path.startsWith('/admin/products');

    return (
        <header className="sticky top-0 z-50 bg-white">
            <div className="bg-black text-white">
                <div className={cn(ADMIN_SHELL_MAX, 'flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-[100px]')}>
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
                        <span className="font-poppins text-sm font-medium text-white/90">
                            Administration PCJ
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        <Link
                            href={route('home')}
                            className="font-poppins font-normal text-white/90 transition-opacity hover:text-white"
                        >
                            Voir la boutique
                        </Link>
                        <div className="flex items-center gap-2 text-white/90">
                            <Globe className="size-5" strokeWidth={1.5} />
                            <span className="font-poppins font-normal">Lubumbashi</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-neutral-200 bg-white">
                <div
                    className={cn(
                        ADMIN_SHELL_MAX,
                        'flex items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-[100px]',
                    )}
                >
                    <StorefrontLogo variant="on-light" href={route('admin.dashboard')} />

                    <nav className="hidden items-center gap-1 lg:flex">
                        {MAIN_NAV.map((item) => (
                            <MainNavLink key={item.href} item={item} path={path} />
                        ))}
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
                                        <Settings className="mr-2 size-4" />
                                        Paramètres
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('logout')} method="post">
                                        <LogOut className="mr-2 size-4" />
                                        Déconnexion
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button
                            type="button"
                            className="rounded-sm p-2 hover:bg-neutral-100 lg:hidden"
                            aria-label="Menu"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="size-6" />
                        </button>
                    </div>
                </div>
            </div>

            {showStockSubnav && (
                <div className="hidden border-b border-neutral-100 bg-[#f0f0f0] md:block">
                    <div
                        className={cn(
                            ADMIN_SHELL_MAX,
                            'flex flex-wrap items-center gap-6 px-4 py-3 sm:px-8 lg:px-[100px]',
                        )}
                    >
                        {STOCK_NAV.map((item) => (
                            <SubNavLink key={item.href} item={item} path={path} />
                        ))}
                    </div>
                </div>
            )}

            {mobileOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/60"
                        aria-label="Fermer"
                        onClick={closeMobile}
                    />
                    <div className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <span className="font-poppins font-semibold">Menu admin</span>
                            <button type="button" className="p-2" onClick={closeMobile}>
                                <X className="size-5" />
                            </button>
                        </div>
                        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
                            {MAIN_NAV.map((item) => {
                                const Icon = item.icon;
                                const active = item.match(path);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'font-poppins inline-flex items-center gap-2 py-2 text-base',
                                            active ? 'font-semibold text-[#0059DD]' : 'text-black',
                                        )}
                                        onClick={closeMobile}
                                    >
                                        <Icon className="size-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                            {showStockSubnav && (
                                <>
                                    <p className="mt-4 font-poppins text-xs font-semibold uppercase tracking-wider text-[#747474]">
                                        Stocks
                                    </p>
                                    {STOCK_NAV.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'font-poppins py-2 text-base',
                                                item.match(path)
                                                    ? 'font-semibold text-[#0059DD]'
                                                    : 'text-black',
                                            )}
                                            onClick={closeMobile}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </>
                            )}
                        </nav>
                        <div className="border-t p-4 font-poppins">
                            <p className="truncate font-semibold">{auth.user?.name}</p>
                            <p className="mb-3 truncate text-sm text-[#747474]">{auth.user?.email}</p>
                            <Link
                                href={route('logout')}
                                method="post"
                                className="flex items-center gap-2 py-2 text-sm hover:text-[#0059DD]"
                                onClick={closeMobile}
                            >
                                <LogOut className="size-4" />
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
