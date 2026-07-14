import { Head, Link } from '@inertiajs/react';
import { Clock, Heart, MessageSquare, ShoppingCart, Wallet } from 'lucide-react';
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

type DeliveryInfo = {
    method: string | null;
    method_label: string;
    full_name: string | null;
    whatsapp: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
} | null;

type OrderRow = {
    id: number;
    total: number;
    status: string;
    created_at: string;
    delivery: NonNullable<DeliveryInfo>;
    payment_method: string | null;
    items: OrderItem[];
};

type CategoryPref = {
    name: string;
    quantity: number;
};

type Props = {
    customer: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        avatar_url: string | null;
        email_verified: boolean;
        member_since: string | null;
        orders_count: number;
        favorites_count: number;
        reviews_count: number;
        total_spent: number;
        last_order_at: string | null;
        last_delivery: DeliveryInfo;
        top_categories: CategoryPref[];
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

function ProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
            <p className="truncate font-poppins text-sm font-medium text-neutral-900">{value}</p>
        </div>
    );
}

export default function AdminSalesCustomerShow({ customer, orders }: Props) {
    const initials = customer.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');

    const deliveryPlace = customer.last_delivery
        ? [customer.last_delivery.address, customer.last_delivery.city, customer.last_delivery.district]
              .filter(Boolean)
              .join(' · ')
        : '';

    return (
        <>
            <Head title={`Client · ${customer.name}`} />

            <div className={ADMIN_PAGE_SECTION}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                        <div className="size-14 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 sm:size-16">
                            {customer.avatar_url ? (
                                <img
                                    src={customer.avatar_url}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-lg font-semibold text-neutral-600">
                                    {initials || '?'}
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h1 className="truncate font-poppins text-2xl font-bold tracking-tight text-black sm:text-3xl">
                                {customer.name}
                            </h1>
                            <p className={cn(ADMIN_MUTED, 'mt-0.5 truncate text-sm sm:text-base')}>
                                {customer.email}
                            </p>
                            <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm">
                                {customer.email_verified ? 'Email vérifié' : 'Email non vérifié'}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route('admin.sales.customers.index')}
                        className={cn(ADMIN_BTN_SM_OUTLINE, 'shrink-0 self-start sm:self-center')}
                    >
                        ← Tous les clients
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                        label="Favoris"
                        value={customer.favorites_count}
                        hint="Produits en favoris"
                        icon={Heart}
                    />
                    <AdminStatCard
                        label="Avis"
                        value={customer.reviews_count}
                        hint="Avis laissés"
                        icon={MessageSquare}
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

                <div className="grid gap-4 lg:grid-cols-2">
                    <AdminCard className="!p-5 sm:!p-6">
                        <AdminCardHeader className="mb-4 pb-3">
                            <h3 className={cn(ADMIN_H3, 'text-lg sm:text-xl lg:text-2xl')}>
                                Profil
                            </h3>
                            <AdminCardDescription className="text-sm">
                                Identité et contact
                            </AdminCardDescription>
                        </AdminCardHeader>
                        <AdminCardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <ProfileField label="Nom" value={customer.name} />
                                <ProfileField label="Email" value={customer.email || '—'} />
                                <ProfileField
                                    label="Téléphone"
                                    value={customer.phone || 'Non renseigné'}
                                />
                                <ProfileField
                                    label="Date d'inscription"
                                    value={
                                        customer.member_since
                                            ? new Date(customer.member_since).toLocaleDateString(
                                                  'fr-FR',
                                              )
                                            : '—'
                                    }
                                />
                            </div>
                            {customer.top_categories.length > 0 ? (
                                <div className="mt-5 border-t border-neutral-100 pt-4">
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                                        Catégories préférées
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {customer.top_categories.map((cat) => (
                                            <span
                                                key={cat.name}
                                                className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-800"
                                            >
                                                {cat.name} · {cat.quantity} art.
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard className="!p-5 sm:!p-6">
                        <AdminCardHeader className="mb-4 pb-3">
                            <h3 className={cn(ADMIN_H3, 'text-lg sm:text-xl lg:text-2xl')}>
                                Livraison / retrait
                            </h3>
                            <AdminCardDescription className="text-sm">
                                Dernière information de livraison connue
                            </AdminCardDescription>
                        </AdminCardHeader>
                        <AdminCardContent>
                            {customer.last_delivery ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <ProfileField
                                        label="Mode"
                                        value={customer.last_delivery.method_label}
                                    />
                                    <ProfileField
                                        label="WhatsApp"
                                        value={customer.last_delivery.whatsapp || '—'}
                                    />
                                    <ProfileField
                                        label="Nom livraison"
                                        value={customer.last_delivery.full_name || '—'}
                                    />
                                    {customer.last_delivery.method !== 'store_pickup' ? (
                                        <ProfileField
                                            label="Adresse"
                                            value={deliveryPlace || '—'}
                                        />
                                    ) : (
                                        <ProfileField
                                            label="Adresse"
                                            value="Retrait en boutique"
                                        />
                                    )}
                                </div>
                            ) : (
                                <p className={cn(ADMIN_MUTED, 'py-6 text-center text-sm')}>
                                    Aucune adresse enregistrée pour ce client.
                                </p>
                            )}
                        </AdminCardContent>
                    </AdminCard>
                </div>

                <AdminCard className="!p-5 sm:!p-6">
                    <AdminCardHeader className="mb-4 pb-3">
                        <h3 className={cn(ADMIN_H3, 'text-lg sm:text-xl lg:text-2xl')}>
                            Historique des commandes
                        </h3>
                        <AdminCardDescription className="text-sm">
                            {orders.length} commande(s) · articles, livraison et montants
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent className="space-y-4">
                        {orders.length === 0 ? (
                            <p className={cn(ADMIN_MUTED, 'py-10 text-center')}>
                                Aucune commande.
                            </p>
                        ) : (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="overflow-hidden rounded-sm border border-neutral-100"
                                >
                                    <div className="grid gap-2 border-b border-neutral-100 bg-[#fafafa] px-4 py-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-4">
                                        <span className="font-poppins font-semibold text-black">
                                            Commande #{order.id}
                                        </span>
                                        <span className={cn(ADMIN_MUTED, 'text-sm')}>
                                            {new Date(order.created_at).toLocaleString('fr-FR')}
                                        </span>
                                        <AdminBadge
                                            variant={orderStatusBadgeVariant(order.status)}
                                        >
                                            {statusLabel(order.status)}
                                        </AdminBadge>
                                        <span className="font-poppins text-sm font-semibold tabular-nums text-neutral-900 sm:text-right">
                                            {`$${Number(order.total).toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="space-y-0.5 border-b border-neutral-100 px-4 py-2.5 text-sm">
                                        <p className="font-medium text-neutral-900">
                                            {order.delivery.method_label}
                                        </p>
                                        {order.delivery.method === 'home_delivery' ? (
                                            <p className="text-neutral-500">
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
                                            <p className="text-neutral-500">
                                                WhatsApp {order.delivery.whatsapp}
                                            </p>
                                        ) : null}
                                    </div>
                                    <AdminDataTable className="!mx-0 border-0 !rounded-none">
                                        <TableHeader>
                                            <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                                <TableHead className={ADMIN_TABLE_HEAD}>
                                                    Produit
                                                </TableHead>
                                                <TableHead
                                                    className={cn(
                                                        ADMIN_TABLE_HEAD,
                                                        ADMIN_TABLE_COL_MD,
                                                    )}
                                                >
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
                                                            <div className="size-11 shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50">
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
                                                                <p className="truncate font-medium text-neutral-900">
                                                                    {it.product_name}
                                                                </p>
                                                                <p className="text-xs text-neutral-500 md:hidden">
                                                                    {[it.color, it.size ? `Taille ${it.size}` : null]
                                                                        .filter(Boolean)
                                                                        .join(' · ') || null}
                                                                </p>
                                                                {it.size ? (
                                                                    <p className="hidden text-xs text-neutral-500 md:block">
                                                                        Taille {it.size}
                                                                    </p>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        className={cn(
                                                            ADMIN_TABLE_CELL,
                                                            ADMIN_TABLE_COL_MD,
                                                        )}
                                                    >
                                                        {it.color ? (
                                                            <span className="inline-flex items-center gap-2">
                                                                <span
                                                                    className="inline-block size-3.5 shrink-0 rounded-full border border-neutral-300"
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
                                                            <span className="text-neutral-400">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        className={cn(
                                                            ADMIN_TABLE_CELL,
                                                            'text-right tabular-nums',
                                                        )}
                                                    >
                                                        {it.quantity}
                                                    </TableCell>
                                                    <TableCell
                                                        className={cn(
                                                            ADMIN_TABLE_CELL,
                                                            'text-right font-semibold tabular-nums text-neutral-900',
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
