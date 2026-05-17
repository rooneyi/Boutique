import { ReactNode, useState } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HOME_ASSETS } from '@/lib/home-assets';
import {
    ADMIN_BTN_GHOST,
    ADMIN_BTN_GHOST_ACTIVE,
    ADMIN_SIDEBAR_SECTION,
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
        label: 'Analyse des ventes',
        href: route('admin.analytics.sales'),
        icon: BarChart3,
        match: (path) => path.startsWith('/admin/analytics'),
    },
    {
        label: 'Produits',
        href: route('admin.products.index'),
        icon: Package,
        match: (path) => path === '/admin/products',
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
        label: 'Produits terminés',
        href: route('admin.products.discontinued'),
        icon: ShoppingBag,
        match: (path) => path.endsWith('/discontinued'),
    },
];

function SidebarLink({
    item,
    path,
    onNavigate,
}: {
    item: NavItem;
    path: string;
    onNavigate?: () => void;
}) {
    const active = item.match(path);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={active ? ADMIN_BTN_GHOST_ACTIVE : ADMIN_BTN_GHOST}
        >
            <Icon className="size-4 shrink-0" strokeWidth={1.5} />
            {item.label}
        </Link>
    );
}

function SidebarNav({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
    return (
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            <p className={ADMIN_SIDEBAR_SECTION}>Pilotage</p>
            {MAIN_NAV.map((item) => (
                <SidebarLink key={item.href} item={item} path={path} onNavigate={onNavigate} />
            ))}

            <p className={cn(ADMIN_SIDEBAR_SECTION, 'mt-6')}>Stocks</p>
            {STOCK_NAV.map((item) => (
                <SidebarLink key={item.href} item={item} path={path} onNavigate={onNavigate} />
            ))}
        </nav>
    );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const page = usePage();
    const auth = page.props.auth as { user?: { name?: string; email?: string } };
    const [mobileOpen, setMobileOpen] = useState(false);
    const path = page.url.split('?')[0] ?? '';
    const closeMobile = () => setMobileOpen(false);

    return (
        <div className="admin-ui flex min-h-screen bg-neutral-50 font-poppins text-black antialiased scheme-light">
            <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
                <div className="border-b border-neutral-200 px-5 py-5">
                    <Link href={route('admin.dashboard')} className="flex items-center gap-3">
                        <img src={HOME_ASSETS.logo} alt="PCJ" className="size-11 object-contain" />
                        <div>
                            <p className="font-poppins text-base font-semibold text-black">PCJ</p>
                            <p className="font-poppins text-xs font-medium text-[#747474]">Administration</p>
                        </div>
                    </Link>
                </div>
                <SidebarNav path={path} />
                <div className="border-t border-neutral-200 px-5 py-4">
                    <p className="truncate font-poppins text-sm font-semibold text-black">
                        {auth.user?.name}
                    </p>
                    <p className="truncate font-poppins text-xs text-[#747474]">{auth.user?.email}</p>
                </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3 md:hidden">
                            <button
                                type="button"
                                className="rounded-sm p-2 hover:bg-neutral-100"
                                aria-label="Ouvrir le menu"
                                onClick={() => setMobileOpen(true)}
                            >
                                <Menu className="size-6" />
                            </button>
                            <Link href={route('admin.dashboard')} className="flex items-center gap-2">
                                <img src={HOME_ASSETS.logo} alt="PCJ" className="size-9 object-contain" />
                                <span className="font-poppins text-sm font-semibold">Admin PCJ</span>
                            </Link>
                        </div>

                        <p className="hidden font-poppins text-sm font-medium text-[#747474] md:block">
                            Espace administration — Poser Comme Jamais
                        </p>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="font-poppins max-w-[220px] truncate rounded-sm px-3 py-2 text-base font-normal text-black hover:bg-neutral-100"
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
                    </div>
                </header>

                <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
                    {children}
                </main>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-[60] md:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label="Fermer le menu"
                        onClick={closeMobile}
                    />
                    <aside className="absolute left-0 top-0 flex h-full w-[min(100%,300px)] flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <span className="font-poppins font-semibold">Menu admin</span>
                            <button
                                type="button"
                                className="rounded-sm p-2 hover:bg-neutral-100"
                                onClick={closeMobile}
                            >
                                <X className="size-5" />
                            </button>
                        </div>
                        <SidebarNav path={path} onNavigate={closeMobile} />
                        <div className="border-t p-4">
                            <p className="truncate text-sm font-semibold">{auth.user?.name}</p>
                            <p className="mb-3 truncate text-xs text-[#747474]">{auth.user?.email}</p>
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
                    </aside>
                </div>
            )}

            <FlashToaster />
        </div>
    );
}
