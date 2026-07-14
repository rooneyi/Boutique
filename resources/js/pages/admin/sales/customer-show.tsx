import { Head, Link } from '@inertiajs/react';
import { Clock, ShoppingCart, Wallet } from 'lucide-react';
import { AdminBadge, orderStatusBadgeVariant } from '@/components/admin/admin-badge';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
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
import { route } from '@/lib/route';
import {
    ADMIN_BTN_SM_OUTLINE,
    ADMIN_H3,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
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

type OrderRow = {
    id: number;
    total: number;
    status: string;
    created_at: string;
    items: OrderItem[];
};

type Props = {
    customer: {
        id: number;
        name: string;
        email: string;
        orders_count: number;
        total_spent: number;
        last_order_at: string | null;
    };
    orders: OrderRow[];
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

export default function AdminSalesCustomerShow({ customer, orders }: Props) {
    return (
        <>
            <Head title={`Client · ${customer.name}`} />

            <div className={ADMIN_PAGE_SECTION}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div>
                        <h1 className="font-poppins text-3xl font-bold tracking-tight text-black">
                            {customer.name}
                        </h1>
                        <p className={cn(ADMIN_MUTED, 'mt-1 text-base')}>{customer.email}</p>
                    </div>
                    <Link
                        href={route('admin.sales.customers.index')}
                        className={cn(ADMIN_BTN_SM_OUTLINE, 'shrink-0')}
                    >
                        ← Tous les clients
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <AdminStatCard
                        label="Commandes"
                        value={customer.orders_count}
                        hint="Nombre total de commandes"
                        icon={ShoppingCart}
                    />
                    <AdminStatCard
                        label="Total dépensé"
                        value={`$${Number(customer.total_spent).toFixed(2)}`}
                        hint="Montant cumulé"
                        icon={Wallet}
                        accent
                    />
                    <AdminStatCard
                        label="Dernière commande"
                        value={
                            customer.last_order_at
                                ? new Date(customer.last_order_at).toLocaleDateString('fr-FR')
                                : '—'
                        }
                        hint="Date de la dernière transaction"
                        icon={Clock}
                    />
                </div>

                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>Historique des commandes</h3>
                        <AdminCardDescription>
                            {orders.length} commande(s) · détail des articles et montants
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent className="space-y-6">
                        {orders.length === 0 ? (
                            <p className={cn(ADMIN_MUTED, 'py-12 text-center')}>
                                Aucune commande.
                            </p>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="overflow-hidden rounded-sm border border-neutral-100"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-[#fafafa] px-4 py-3">
                                        <span className="font-poppins font-semibold text-black">
                                            Commande #{order.id}
                                        </span>
                                        <span className={ADMIN_MUTED}>
                                            {new Date(order.created_at).toLocaleString('fr-FR')}
                                        </span>
                                        <AdminBadge
                                            variant={orderStatusBadgeVariant(order.status)}
                                        >
                                            {statusLabel(order.status)}
                                        </AdminBadge>
                                        <span className="font-poppins font-semibold text-neutral-900">
                                            {`$${Number(order.total).toFixed(2)}`}
                                        </span>
                                    </div>
                                    <AdminDataTable>
                                        <TableHeader>
                                            <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                                <TableHead className={ADMIN_TABLE_HEAD}>
                                                    Produit
                                                </TableHead>
                                                <TableHead className={ADMIN_TABLE_HEAD}>
                                                    Couleur
                                                </TableHead>
                                                <TableHead
                                                    className={cn(ADMIN_TABLE_HEAD, 'text-right')}
                                                >
                                                    Qté
                                                </TableHead>
                                                <TableHead
                                                    className={cn(ADMIN_TABLE_HEAD, 'text-right')}
                                                >
                                                    Sous-total
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((it, idx) => (
                                                <TableRow
                                                    key={`${order.id}-${idx}`}
                                                    className={ADMIN_TABLE_ROW}
                                                >
                                                    <TableCell className={ADMIN_TABLE_CELL}>
                                                        <div className="flex min-w-0 items-center gap-3">
                                                            <div className="size-12 shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50">
                                                                {it.image_path ? (
                                                                    <img
                                                                        src={it.image_path}
                                                                        alt=""
                                                                        className="size-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="size-full bg-neutral-100" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-medium text-neutral-900">
                                                                    {it.product_name}
                                                                </p>
                                                                {it.size ? (
                                                                    <p className="text-xs text-neutral-500">
                                                                        Taille {it.size}
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={ADMIN_TABLE_CELL}>
                                                        {it.color ? (
                                                            <span className="inline-flex items-center gap-2">
                                                                <span
                                                                    className="inline-block size-3.5 rounded-full border border-neutral-300"
                                                                    style={{
                                                                        backgroundColor:
                                                                            it.color_hex ||
                                                                            '#d4d4d4',
                                                                    }}
                                                                    aria-hidden
                                                                />
                                                                {it.color}
                                                            </span>
                                                        ) : (
                                                            <span className="text-neutral-400">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        className={cn(
                                                            ADMIN_TABLE_CELL,
                                                            'text-right',
                                                        )}
                                                    >
                                                        {it.quantity}
                                                    </TableCell>
                                                    <TableCell
                                                        className={cn(
                                                            ADMIN_TABLE_CELL,
                                                            'text-right font-semibold text-neutral-900',
                                                        )}
                                                    >
                                                        {`$${Number(it.line_total).toFixed(2)}`}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </AdminDataTable>
                                </div>
                            ))
                        )}
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
