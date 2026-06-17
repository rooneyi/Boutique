import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import {
    AdminDataTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    ADMIN_TABLE_CELL,
    ADMIN_TABLE_HEAD,
    ADMIN_TABLE_HEADER_ROW,
    ADMIN_TABLE_ROW,
} from '@/components/admin/admin-table';
import { AdminBadge, type AdminBadgeVariant } from '@/components/admin/admin-badge';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { AdminFilterTabs } from '@/components/admin/admin-filter-tabs';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_SM_PRIMARY,
    ADMIN_H3,
    ADMIN_MOBILE_META,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
    ADMIN_TABLE_COL_LG,
    ADMIN_TABLE_COL_MD,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    status?: string;
    category: string | { id: number; name: string } | null;
    variants_count?: number;
    colors_count?: number;
    colors?: string[];
};

function variantsSummary(product: Product): string {
    const count = product.variants_count ?? 0;
    const colors = product.colors ?? [];
    if (count === 0) {
        return 'Aucune déclinaison';
    }
    const colorPart =
        colors.length > 0
            ? colors.slice(0, 3).join(', ') + (colors.length > 3 ? '…' : '')
            : `€{product.colors_count ?? 0} couleur(s)`;

    return `€{count} déclinaison€{count > 1 ? 's' : ''} · €{colorPart}`;
}

function categoryLabel(category: Product['category']): string {
    if (category == null) {
        return '—';
    }
    if (typeof category === 'string') {
        return category;
    }
    return category.name ?? '—';
}

type Props = {
    products: {
        data: Product[];
    };
    filter?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
};

function getFilterLabel(filter?: Props['filter']) {
    switch (filter) {
        case 'in-stock':
            return 'En stock';
        case 'low-stock':
            return 'Stocks faibles';
        case 'out-of-stock':
            return 'Ruptures';
        case 'discontinued':
            return 'Produits terminés';
        default:
            return 'Tous les produits';
    }
}

function stockBadgeVariant(product: Product): AdminBadgeVariant {
    if (product.status === 'DISCONTINUED') {
        return 'muted';
    }
    if (product.quantity === 0) {
        return 'danger';
    }
    if (product.quantity < 10) {
        return 'warning';
    }
    return 'blue';
}

function stockBadgeLabel(product: Product): string {
    if (product.status === 'DISCONTINUED') {
        return 'Terminé';
    }
    if (product.quantity === 0) {
        return 'Rupture';
    }
    if (product.quantity < 10) {
        return 'Faible';
    }
    return 'En stock';
}

export default function AdminProducts() {
    const { products, filter } = usePage<Props>().props;
    const title = getFilterLabel(filter);

    const tabs = [
        { label: 'Tous', href: route('admin.products.index'), active: filter === 'all' || !filter },
        { label: 'En stock', href: route('admin.products.in-stock'), active: filter === 'in-stock' },
        { label: 'Faible stock', href: route('admin.products.low-stock'), active: filter === 'low-stock' },
        { label: 'Ruptures', href: route('admin.products.out-of-stock'), active: filter === 'out-of-stock' },
    ];

    return (
        <>
            <Head title={title} />

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHeader
                    title={title}
                    description="Gestion du catalogue PCJ — création, édition et stocks."
                    actions={
                        <Link
                            href={route('admin.products.create')}
                            className={ADMIN_BTN_SM_PRIMARY}
                        >
                            <Plus className="size-4" />
                            Nouveau produit
                        </Link>
                    }
                />

                <div className="md:hidden">
                    <AdminFilterTabs tabs={tabs} />
                </div>

                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>{title}</h3>
                        <AdminCardDescription>
                            {products.data.length} produit(s) affiché(s)
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        {products.data.length > 0 ? (
                            <AdminDataTable>
                                    <TableHeader>
                                        <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Produit</TableHead>
                                            <TableHead
                                                className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD, 'text-right')}
                                            >
                                                Prix
                                            </TableHead>
                                            <TableHead
                                                className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD, 'text-right')}
                                            >
                                                Stock total
                                            </TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_LG)}>
                                                Catégorie
                                            </TableHead>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Statut</TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, 'text-right')}>
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.data.map((product) => (
                                            <TableRow key={product.id} className={ADMIN_TABLE_ROW}>
                                                <TableCell className={cn(ADMIN_TABLE_CELL, 'max-w-[12rem] font-medium text-neutral-900 sm:max-w-none')}>
                                                    <span className="line-clamp-2 sm:line-clamp-none">
                                                        {product.name}
                                                    </span>
                                                    <span className={ADMIN_MOBILE_META}>
                                                        {variantsSummary(product)}
                                                    </span>
                                                    <span className={ADMIN_MOBILE_META}>
                                                        €{Number(product.price).toFixed(2)} · Stock{' '}
                                                        {product.quantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell
                                                    className={cn(
                                                        ADMIN_TABLE_CELL,
                                                        ADMIN_TABLE_COL_MD,
                                                        'text-right',
                                                    )}
                                                >
                                                    €{Number(product.price).toFixed(2)}
                                                </TableCell>
                                                <TableCell
                                                    className={cn(
                                                        ADMIN_TABLE_CELL,
                                                        ADMIN_TABLE_COL_MD,
                                                        'text-right',
                                                    )}
                                                >
                                                    {product.quantity}
                                                </TableCell>
                                                <TableCell className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_LG)}>
                                                    <span>{categoryLabel(product.category)}</span>
                                                    <span className="mt-0.5 hidden font-poppins text-xs text-[#999] sm:block">
                                                        {variantsSummary(product)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <AdminBadge variant={stockBadgeVariant(product)}>
                                                        {stockBadgeLabel(product)}
                                                    </AdminBadge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={route('admin.products.edit', product.id)}
                                                        className="inline-flex items-center gap-1 font-poppins text-sm font-medium text-[#0059DD] hover:underline"
                                                    >
                                                        <Pencil className="size-4" />
                                                        Éditer
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                            </AdminDataTable>
                        ) : (
                            <p className={cn(ADMIN_MUTED, 'py-12 text-center')}>Aucun produit à afficher</p>
                        )}
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
