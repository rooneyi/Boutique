import { Head, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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
import { ADMIN_H3, ADMIN_MUTED, ADMIN_TABLE_CELL, ADMIN_TABLE_HEAD } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    status?: string;
    category: string | { id: number; name: string } | null;
    vendor: {
        shop_name: string;
    };
};

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
        { label: 'Terminés', href: route('admin.products.discontinued'), active: filter === 'discontinued' },
    ];

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <AdminPageHeader
                    title={title}
                    description="Supervision de l'inventaire sur toute la plateforme."
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
                            <div className="overflow-x-auto rounded-sm border border-neutral-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className={ADMIN_TABLE_HEAD}>Produit</TableHead>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Vendeur</TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, 'text-right')}>
                                                Prix
                                            </TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, 'text-right')}>
                                                Stock
                                            </TableHead>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Catégorie</TableHead>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Statut</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className={cn(ADMIN_TABLE_CELL, 'font-medium')}>
                                                    {product.name}
                                                </TableCell>
                                                <TableCell className={ADMIN_TABLE_CELL}>
                                                    {product.vendor?.shop_name}
                                                </TableCell>
                                                <TableCell className={cn(ADMIN_TABLE_CELL, 'text-right')}>
                                                    €{Number(product.price).toFixed(2)}
                                                </TableCell>
                                                <TableCell className={cn(ADMIN_TABLE_CELL, 'text-right')}>
                                                    {product.quantity}
                                                </TableCell>
                                                <TableCell className={ADMIN_TABLE_CELL}>
                                                    {categoryLabel(product.category)}
                                                </TableCell>
                                                <TableCell>
                                                    <AdminBadge variant={stockBadgeVariant(product)}>
                                                        {stockBadgeLabel(product)}
                                                    </AdminBadge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className={cn(ADMIN_MUTED, 'py-12 text-center')}>Aucun produit à afficher</p>
                        )}
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
