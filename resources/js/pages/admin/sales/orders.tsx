import { Head, Link } from '@inertiajs/react';
import { AdminBadge, orderStatusBadgeVariant } from '@/components/admin/admin-badge';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
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
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_SM_OUTLINE,
    ADMIN_H3,
    ADMIN_MOBILE_META,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
    ADMIN_TABLE_COL_LG,
    ADMIN_TABLE_COL_MD,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type OrderItem = {
    product_name: string;
    quantity: number;
    line_total: number;
    image_path: string | null;
    color: string | null;
    color_hex: string | null;
    size: string | null;
};

type Delivery = {
    method: string | null;
    method_label: string;
    full_name: string | null;
    whatsapp: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
};

type Order = {
    id: number;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
    delivery: Delivery;
    items: OrderItem[];
};

type Props = {
    orders: {
        data: Order[];
    };
};

function statusLabel(status: string): string {
    switch (status.toUpperCase()) {
        case 'PAID':
            return 'Payée';
        case 'PENDING':
            return 'En attente';
        case 'CANCELLED':
            return 'Annulée';
        case 'SHIPPED':
            return 'Expédiée';
        case 'DELIVERED':
            return 'Livrée';
        default:
            return status;
    }
}

function deliverySummary(delivery: Delivery): string {
    if (delivery.method === 'store_pickup') {
        return delivery.method_label;
    }

    const place = [delivery.address, delivery.city, delivery.district]
        .filter(Boolean)
        .join(', ');

    if (delivery.method === 'home_delivery') {
        return place ? `${delivery.method_label} · ${place}` : delivery.method_label;
    }

    return place || delivery.method_label;
}

function OrderItemThumb({ item }: { item: OrderItem }) {
    return (
        <div className="flex min-w-0 items-center gap-2.5">
            <div className="size-10 shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50">
                {item.image_path ? (
                    <img
                        src={item.image_path}
                        alt=""
                        className="size-full object-cover"
                    />
                ) : (
                    <div className="size-full bg-neutral-100" />
                )}
            </div>
            <div className="min-w-0">
                <p className="truncate font-medium text-neutral-900">{item.product_name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                    <span>×{item.quantity}</span>
                    {item.color ? (
                        <span className="inline-flex items-center gap-1">
                            <span
                                className="inline-block size-2.5 rounded-full border border-neutral-300"
                                style={{ backgroundColor: item.color_hex || '#d4d4d4' }}
                                aria-hidden
                            />
                            {item.color}
                        </span>
                    ) : null}
                    {item.size ? <span>· {item.size}</span> : null}
                </div>
            </div>
        </div>
    );
}

export default function AdminSalesOrders({ orders }: Props) {
    return (
        <>
            <Head title="Commandes" />

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHeader
                    title="Commandes"
                    description="Toutes les commandes de la plateforme — statuts, clients et montants."
                    actions={
                        <Link href={route('admin.dashboard')} className={ADMIN_BTN_SM_OUTLINE}>
                            Tableau de bord
                        </Link>
                    }
                />

                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>Historique des commandes</h3>
                        <AdminCardDescription>
                            {orders.data.length} commande(s) · produits vendus et statuts
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        {orders.data.length === 0 ? (
                            <p className={cn(ADMIN_MUTED, 'py-12 text-center')}>
                                Aucune commande pour le moment.
                            </p>
                        ) : (
                            <AdminDataTable>
                                <TableHeader>
                                    <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                        <TableHead className={ADMIN_TABLE_HEAD}>#</TableHead>
                                        <TableHead className={ADMIN_TABLE_HEAD}>Client</TableHead>
                                        <TableHead className={cn(ADMIN_TABLE_HEAD, 'text-right')}>
                                            Total
                                        </TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD)}
                                        >
                                            Date
                                        </TableHead>
                                        <TableHead className={ADMIN_TABLE_HEAD}>Statut</TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_LG)}
                                        >
                                            Livraison
                                        </TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_LG)}
                                        >
                                            Articles
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.map((order) => (
                                        <TableRow key={order.id} className={ADMIN_TABLE_ROW}>
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    'font-semibold text-neutral-900',
                                                )}
                                            >
                                                #{order.id}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    'font-medium text-neutral-900',
                                                )}
                                            >
                                                {order.customer_name}
                                                <span className={ADMIN_MOBILE_META}>
                                                    {new Date(order.created_at).toLocaleDateString(
                                                        'fr-FR',
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    'text-right font-semibold text-neutral-900',
                                                )}
                                            >
                                                {`$${Number(order.total).toFixed(2)}`}
                                            </TableCell>
                                            <TableCell
                                                className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_MD)}
                                            >
                                                {new Date(order.created_at).toLocaleDateString(
                                                    'fr-FR',
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <AdminBadge
                                                    variant={orderStatusBadgeVariant(order.status)}
                                                >
                                                    {statusLabel(order.status)}
                                                </AdminBadge>
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    ADMIN_TABLE_COL_LG,
                                                    'max-w-[220px]',
                                                )}
                                            >
                                                <p className="truncate font-medium text-neutral-900">
                                                    {order.delivery.method_label}
                                                </p>
                                                {order.delivery.method === 'home_delivery' ? (
                                                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                                                        {[
                                                            order.delivery.address,
                                                            order.delivery.city,
                                                            order.delivery.district,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(' · ') || 'Adresse à confirmer'}
                                                    </p>
                                                ) : null}
                                                {order.delivery.whatsapp ? (
                                                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                                                        WhatsApp {order.delivery.whatsapp}
                                                    </p>
                                                ) : null}
                                                <span className={ADMIN_MOBILE_META}>
                                                    {deliverySummary(order.delivery)}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    ADMIN_TABLE_COL_LG,
                                                    'min-w-[220px]',
                                                )}
                                            >
                                                <div className="flex flex-col gap-2">
                                                    {order.items.map((item, idx) => (
                                                        <OrderItemThumb
                                                            key={`${order.id}-${idx}`}
                                                            item={item}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </AdminDataTable>
                        )}
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
