import { Head, Link } from '@inertiajs/react';
import { AdminBadge, orderStatusBadgeVariant } from '@/components/admin/admin-badge';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { AdminPageHero } from '@/components/admin/admin-page-hero';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_PILL_DARK,
    ADMIN_BTN_PILL_OUTLINE,
    ADMIN_H3,
    ADMIN_LIST_ROW,
    ADMIN_LIST_ROW_STACKED,
    ADMIN_MOBILE_META,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';
import { Package, Plus, ShoppingCart, TrendingUp, Users } from 'lucide-react';

type AdminStats = {
    total_vendors: number;
    total_customers: number;
    total_products: number;
    total_sales: number;
    total_orders: number;
    avg_order_value: number;
    new_customers: number;
    top_products: Array<{
        id: number;
        name: string;
        price: number;
        stock: number;
        total_sold: number;
    }>;
    recent_orders: Array<{
        id: number;
        customer_name: string;
        total: number;
        status: string;
        created_at: string;
    }>;
};

const EMPTY_STATS: AdminStats = {
    total_vendors: 0,
    total_customers: 0,
    total_products: 0,
    total_sales: 0,
    total_orders: 0,
    avg_order_value: 0,
    new_customers: 0,
    top_products: [],
    recent_orders: [],
};

export default function AdminDashboard({ stats: statsProp }: { stats?: AdminStats }) {
    const stats = statsProp ?? EMPTY_STATS;

    return (
        <>
            <Head title="Tableau de bord" />

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHero
                    title="Tableau de bord"
                    description="Vue d'ensemble de la plateforme PCJ — ventes, catalogue et utilisateurs."
                    actions={
                        <>
                            <Link href={route('admin.analytics.sales')} className={ADMIN_BTN_PILL_OUTLINE}>
                                Analyse des ventes
                            </Link>
                            <Link href={route('admin.products.index')} className={ADMIN_BTN_PILL_DARK}>
                                <Plus className="size-5" />
                                Catalogue produits
                            </Link>
                        </>
                    }
                />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="Chiffre d'affaires"
                        value={`€${stats.total_sales.toFixed(2)}`}
                        hint="Total plateforme"
                        icon={TrendingUp}
                        accent
                    />
                    <AdminStatCard
                        label="Commandes"
                        value={stats.total_orders}
                        hint="Commandes enregistrées"
                        icon={ShoppingCart}
                    />
                    <AdminStatCard
                        label="Produits actifs"
                        value={stats.total_products}
                        hint={`${stats.total_vendors} vendeurs · ${stats.total_customers} clients`}
                        icon={Package}
                    />
                    <AdminStatCard
                        label="Nouveaux clients"
                        value={stats.new_customers}
                        hint="7 derniers jours"
                        icon={Users}
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                    <AdminCard>
                        <AdminCardHeader>
                            <h3 className={ADMIN_H3}>Produits populaires</h3>
                            <AdminCardDescription>Top ventes sur la plateforme</AdminCardDescription>
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-3">
                            {stats.top_products.length > 0 ? (
                                stats.top_products.map((product) => (
                                    <div
                                        key={product.id}
                                        className={cn(
                                            ADMIN_LIST_ROW,
                                            'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4',
                                        )}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="font-poppins font-semibold text-black">
                                                {product.name}
                                            </p>
                                            <p className={cn(ADMIN_MUTED, 'text-sm')}>
                                                Stock : {product.stock}
                                            </p>
                                        </div>
                                        <AdminBadge className="self-start sm:self-center" variant="blue">
                                            {product.total_sold} vendus
                                        </AdminBadge>
                                    </div>
                                ))
                            ) : (
                                <p className={ADMIN_MUTED}>Aucun produit pour le moment.</p>
                            )}
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard>
                        <AdminCardHeader>
                            <h3 className={ADMIN_H3}>Indicateurs</h3>
                            <AdminCardDescription>Panier moyen et répartition</AdminCardDescription>
                        </AdminCardHeader>
                        <AdminCardContent className="space-y-4">
                            <div className={ADMIN_LIST_ROW}>
                                <p className={ADMIN_MUTED}>Panier moyen</p>
                                <p className="font-poppins text-2xl font-semibold text-[#0059DD]">
                                    €{stats.avg_order_value.toFixed(2)}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-sm border border-neutral-100 bg-white p-4 text-center">
                                    <p className="font-poppins text-2xl font-semibold text-black">
                                        {stats.total_vendors}
                                    </p>
                                    <p className={cn(ADMIN_MUTED, 'text-sm')}>Vendeurs</p>
                                </div>
                                <div className="rounded-sm border border-neutral-100 bg-white p-4 text-center">
                                    <p className="font-poppins text-2xl font-semibold text-black">
                                        {stats.total_customers}
                                    </p>
                                    <p className={cn(ADMIN_MUTED, 'text-sm')}>Clients</p>
                                </div>
                            </div>
                        </AdminCardContent>
                    </AdminCard>
                </div>

                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>Commandes récentes</h3>
                        <AdminCardDescription>Dernières transactions enregistrées</AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        {stats.recent_orders.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recent_orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className={ADMIN_LIST_ROW_STACKED}
                                    >
                                        <div className="flex items-center justify-between gap-2 md:col-span-2 md:block">
                                            <span className={ADMIN_MOBILE_META}>Commande</span>
                                            <span className="font-poppins font-semibold text-black">
                                                #{order.id}
                                            </span>
                                        </div>
                                        <div className="min-w-0 md:col-span-3">
                                            <span className={ADMIN_MOBILE_META}>Client</span>
                                            <span className={cn(ADMIN_MUTED, 'md:text-sm')}>
                                                {order.customer_name}
                                            </span>
                                        </div>
                                        <div className="md:col-span-3">
                                            <span className={ADMIN_MOBILE_META}>Date</span>
                                            <span className={cn(ADMIN_MUTED, 'md:text-sm')}>
                                                {order.created_at}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 md:col-span-2 md:block">
                                            <span className={ADMIN_MOBILE_META}>Montant</span>
                                            <span className="font-poppins font-semibold text-black">
                                                €{order.total.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 md:col-span-2 md:block">
                                            <span className={ADMIN_MOBILE_META}>Statut</span>
                                            <AdminBadge variant={orderStatusBadgeVariant(order.status)}>
                                                {order.status}
                                            </AdminBadge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={ADMIN_MUTED}>Aucune commande récente.</p>
                        )}
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
