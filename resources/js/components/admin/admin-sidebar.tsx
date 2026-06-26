import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    LayoutDashboard,
    LogOut,
    Package,
    Settings,
    ShoppingCart,
    Tag,
    Users,
    X,
} from 'lucide-react';
import { ADMIN_MAIN_NAV, ADMIN_STOCK_NAV } from '@/lib/admin-nav';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

const NAV_ICONS: Record<string, React.ElementType> = {
    dashboard: LayoutDashboard,
    analytics: BarChart3,
    products: Package,
    categories: Tag,
    sales: ShoppingCart,
    customers: Users,
};

type Props = {
    path: string;
    user?: { id: number; name?: string; email?: string; role?: string } | null;
    mobileOpen: boolean;
    onClose: () => void;
};

export function AdminSidebar({ path, user, mobileOpen, onClose }: Props) {
    const isProductsSection = path.startsWith('/admin/products');

    return (
        <>
            {/* Overlay mobile */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Fermer le menu"
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex h-full w-[240px] flex-col bg-black transition-transform duration-300 lg:static lg:translate-x-0',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* En-tête sidebar */}
                <div className="flex h-16 shrink-0 items-center justify-between px-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#0059DD]">
                            <span className="font-poppins text-sm font-bold text-white">P</span>
                        </div>
                        <div>
                            <p className="font-poppins text-sm font-semibold leading-none text-white">
                                PCJ Admin
                            </p>
                            <p className="font-poppins mt-0.5 text-[10px] font-normal text-white/50">
                                Administration
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex size-7 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
                        onClick={onClose}
                        aria-label="Fermer"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:none]">
                    {/* Section principale */}
                    <div className="mb-1">
                        <p className="px-3 pb-2 font-poppins text-[10px] font-semibold uppercase tracking-widest text-white/40">
                            Navigation
                        </p>
                        <ul className="space-y-0.5">
                            {ADMIN_MAIN_NAV.map((item) => {
                                const Icon = NAV_ICONS[item.key] ?? LayoutDashboard;
                                const active = item.match(path);
                                return (
                                    <li key={item.key}>
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={cn(
                                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150',
                                                active
                                                    ? 'bg-[#0059DD] font-semibold text-white'
                                                    : 'font-medium text-white/70 hover:bg-white/8 hover:text-white',
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    'size-[17px] shrink-0',
                                                    active ? 'text-white' : 'text-white/50',
                                                )}
                                                strokeWidth={active ? 2 : 1.75}
                                            />
                                            <span className="font-poppins">{item.label}</span>
                                        </Link>

                                        {/* Sous-nav Produits */}
                                        {item.key === 'products' && isProductsSection && (
                                            <ul className="ml-9 mt-0.5 space-y-0.5 border-l border-white/15 pl-3">
                                                {ADMIN_STOCK_NAV.map((sub) => {
                                                    const subActive = sub.match(path);
                                                    return (
                                                        <li key={sub.href}>
                                                            <Link
                                                                href={sub.href}
                                                                onClick={onClose}
                                                                className={cn(
                                                                    'block rounded-md px-2 py-1.5 font-poppins text-xs transition-colors',
                                                                    subActive
                                                                        ? 'font-semibold text-[#60a5fa]'
                                                                        : 'font-medium text-white/45 hover:text-white/80',
                                                                )}
                                                            >
                                                                {sub.label}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Section compte */}
                    <div className="mt-5">
                        <p className="px-3 pb-2 font-poppins text-[10px] font-semibold uppercase tracking-widest text-white/40">
                            Compte
                        </p>
                        <ul className="space-y-0.5">
                            <li>
                                <Link
                                    href={route('profile.edit')}
                                    onClick={onClose}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                                        path.startsWith('/settings') || path.startsWith('/profile')
                                            ? 'bg-[#0059DD] font-semibold text-white'
                                            : 'text-white/70 hover:bg-white/8 hover:text-white',
                                    )}
                                >
                                    <Settings
                                        className={cn(
                                            'size-[17px] shrink-0',
                                            path.startsWith('/settings') ? 'text-white' : 'text-white/50',
                                        )}
                                        strokeWidth={1.75}
                                    />
                                    <span className="font-poppins">Paramètres</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Utilisateur */}
                <div className="shrink-0 border-t border-white/15 px-3 py-3">
                    <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0059DD]/20 ring-1 ring-[#0059DD]/30">
                            <span className="font-poppins text-xs font-bold text-[#60a5fa]">
                                {user?.name?.charAt(0).toUpperCase() ?? 'A'}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-poppins truncate text-sm font-semibold leading-tight text-white">
                                {user?.name ?? 'Administrateur'}
                            </p>
                            <p className="font-poppins truncate text-[11px] text-white/50">
                                {user?.email ?? ''}
                            </p>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="shrink-0 rounded-md p-1.5 text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
                            aria-label="Déconnexion"
                        >
                            <LogOut className="size-4" strokeWidth={1.75} />
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
