import { route } from '@/lib/route';

export type AdminNavKey = 'dashboard' | 'analytics' | 'products' | 'categories' | 'sales' | 'customers';

export const ADMIN_MAIN_NAV: {
    key: AdminNavKey;
    label: string;
    shortLabel?: string;
    href: string;
    match: (path: string) => boolean;
}[] = [
    {
        key: 'dashboard',
        label: 'Tableau de bord',
        shortLabel: 'Tableau',
        href: route('admin.dashboard'),
        match: (path) => path === '/admin/dashboard',
    },
    {
        key: 'analytics',
        label: 'Analyse',
        href: route('admin.analytics.sales'),
        match: (path) => path.startsWith('/admin/analytics'),
    },
    {
        key: 'products',
        label: 'Produits',
        href: route('admin.products.index'),
        match: (path) => path.startsWith('/admin/products'),
    },
    {
        key: 'categories',
        label: 'Catégories',
        href: route('admin.categories.index'),
        match: (path) => path.startsWith('/admin/categories'),
    },
    {
        key: 'sales',
        label: 'Ventes',
        href: route('admin.sales.orders.index'),
        match: (path) => path.startsWith('/admin/sales'),
    },
    {
        key: 'customers',
        label: 'Clients',
        href: route('admin.sales.customers.index'),
        match: (path) =>
            path.startsWith('/admin/sales/customers') || path.startsWith('/admin/users/customers'),
    },
];

export const ADMIN_STOCK_NAV = [
    { label: 'Tous', href: route('admin.products.index'), match: (p: string) => p === '/admin/products' },
    { label: 'En stock', href: route('admin.products.in-stock'), match: (p: string) => p.endsWith('/in-stock') },
    { label: 'Faibles stocks', href: route('admin.products.low-stock'), match: (p: string) => p.endsWith('/low-stock') },
    { label: 'Ruptures', href: route('admin.products.out-of-stock'), match: (p: string) => p.endsWith('/out-of-stock') },
] as const;

export function resolveAdminNavKey(path: string): AdminNavKey {
    const item = ADMIN_MAIN_NAV.find((n) => n.match(path));
    return item?.key ?? 'dashboard';
}
