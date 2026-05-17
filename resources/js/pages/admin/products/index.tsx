import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminFilterTabs } from '@/components/admin/admin-filter-tabs';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { route } from '@/lib/route';
import {
    ADMIN_BADGE_BLUE,
    ADMIN_CARD,
    ADMIN_H3,
    ADMIN_MUTED,
    ADMIN_TABLE_CELL,
    ADMIN_TABLE_HEAD,
} from '@/lib/admin-ui-styles';
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

function stockBadge(product: Product) {
    if (product.status === 'DISCONTINUED') {
        return (
            <span className="font-poppins rounded-full border border-neutral-300 px-3 py-1 text-sm text-[#747474]">
                Terminé
            </span>
        );
    }
    if (product.quantity === 0) {
        return (
            <span className="font-poppins rounded-full border-0 bg-[#dc0000] px-3 py-1 text-sm font-medium text-white">
                Rupture
            </span>
        );
    }
    if (product.quantity < 10) {
        return (
            <span className="font-poppins rounded-full border border-black bg-white px-3 py-1 text-sm font-medium text-black">
                Faible
            </span>
        );
    }
    return <span className={ADMIN_BADGE_BLUE}>En stock</span>;
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

                <Card className={ADMIN_CARD}>
                    <CardHeader>
                        <h3 className={ADMIN_H3}>{title}</h3>
                        <CardDescription className={cn(ADMIN_MUTED, 'text-base')}>
                            {products.data.length} produit(s) affiché(s)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                                <TableCell>{stockBadge(product)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className={cn(ADMIN_MUTED, 'py-12 text-center')}>Aucun produit à afficher</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
