import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_PRIMARY,
    ADMIN_BTN_SECONDARY,
    ADMIN_CARD,
    ADMIN_H3,
    ADMIN_MUTED,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

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

            <div className="space-y-10">
                <AdminPageHeader
                    title="Tableau de bord"
                    description="Vue d'ensemble de la plateforme PCJ — ventes, catalogue et utilisateurs."
                    actions={
                        <>
                            <Link href={route('admin.analytics.sales')} className={ADMIN_BTN_SECONDARY}>
                                Analyse des ventes
                            </Link>
                            <Link href={route('admin.products.index')} className={ADMIN_BTN_PRIMARY}>
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
                    <Card className={ADMIN_CARD}>
                        <CardHeader>
                            <h3 className={ADMIN_H3}>Produits populaires</h3>
                            <CardDescription className={cn(ADMIN_MUTED, 'text-base')}>
                                Top ventes sur la plateforme
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {stats.top_products.length > 0 ? (
                                stats.top_products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between gap-4 rounded-sm border border-neutral-200 p-3"
                                    >
                                        <div>
                                            <p className="font-poppins font-medium text-black">
                                                {product.name}
                                            </p>
                                            <p className={cn(ADMIN_MUTED, 'text-sm')}>
                                                Stock : {product.stock}
                                            </p>
                                        </div>
                                        <Badge className="border-0 bg-[#0059DD] font-poppins text-white hover:bg-[#0047b0]">
                                            {product.total_sold} vendus
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className={ADMIN_MUTED}>Aucun produit pour le moment.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className={ADMIN_CARD}>
                        <CardHeader>
                            <h3 className={ADMIN_H3}>Indicateurs</h3>
                            <CardDescription className={cn(ADMIN_MUTED, 'text-base')}>
                                Panier moyen et répartition
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-4">
                                <p className={ADMIN_MUTED}>Panier moyen</p>
                                <p className="font-poppins text-2xl font-semibold text-[#0059DD]">
                                    €{stats.avg_order_value.toFixed(2)}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-sm border border-neutral-200 p-3 text-center">
                                    <p className="font-poppins text-2xl font-semibold text-black">
                                        {stats.total_vendors}
                                    </p>
                                    <p className={cn(ADMIN_MUTED, 'text-sm')}>Vendeurs</p>
                                </div>
                                <div className="rounded-sm border border-neutral-200 p-3 text-center">
                                    <p className="font-poppins text-2xl font-semibold text-black">
                                        {stats.total_customers}
                                    </p>
                                    <p className={cn(ADMIN_MUTED, 'text-sm')}>Clients</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className={ADMIN_CARD}>
                    <CardHeader>
                        <h3 className={ADMIN_H3}>Commandes récentes</h3>
                        <CardDescription className={cn(ADMIN_MUTED, 'text-base')}>
                            Dernières transactions enregistrées
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.recent_orders.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recent_orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="grid grid-cols-2 gap-3 rounded-sm border border-neutral-200 p-4 text-sm md:grid-cols-12 md:items-center"
                                    >
                                        <div className="font-poppins font-semibold text-black md:col-span-2">
                                            #{order.id}
                                        </div>
                                        <div className={cn(ADMIN_MUTED, 'md:col-span-3')}>
                                            {order.customer_name}
                                        </div>
                                        <div className={cn(ADMIN_MUTED, 'md:col-span-3')}>
                                            {order.created_at}
                                        </div>
                                        <div className="font-poppins font-medium text-black md:col-span-2">
                                            €{order.total.toFixed(2)}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Badge
                                                variant="outline"
                                                className="font-poppins border-neutral-300"
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={ADMIN_MUTED}>Aucune commande récente.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
