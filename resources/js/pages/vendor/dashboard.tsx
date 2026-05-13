import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Plus, TrendingUp, Package, Users, AlertTriangle, ShoppingCart, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { route } from '@/lib/route';
import {
    VENDOR_BTN_PRIMARY,
    VENDOR_CARD,
    VENDOR_BADGE,
    VENDOR_H1,
    VENDOR_H3,
    VENDOR_H4,
    VENDOR_MUTED,
} from '@/lib/vendor-ui-styles';
import { cn } from '@/lib/utils';

type LowStockRow = { id: number; name: string; stock: number; price: number; status: string };
type LoyalCustomer = { id: number; name: string; orders_count: number; total_spent: number };

type DashboardStats = {
    total_sales: number;
    total_orders: number;
    total_products: number;
    total_customers: number;
    avg_order_value: number;
    low_stock_products: LowStockRow[];
    top_products: { id: number; name: string; price: number; orders_count: number }[];
    loyal_customers?: LoyalCustomer[];
    recent_orders: {
        id: number;
        customer: { name: string };
        total_amount: number;
        status: string;
        created_at: string;
    }[];
};

export default function VendorDashboard({ stats }: { stats: DashboardStats }) {
    return (
        <>
            <Head title="Tableau de Bord Vendeur" />

            <div className="space-y-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className={VENDOR_H1}>Tableau de bord</h1>
                        <p className={cn(VENDOR_MUTED, 'mt-3 max-w-xl')}>
                            Bienvenue sur votre espace vendeur — suivez vos performances et votre stock.
                        </p>
                    </div>
                    <Link href={route('vendor.products.create')} className={cn(VENDOR_BTN_PRIMARY, 'shrink-0')}>
                        <Plus className="h-5 w-5" />
                        Nouveau produit
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card className={VENDOR_CARD}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h4 className={VENDOR_H4}>Chiffre d&apos;affaires</h4>
                            <TrendingUp className="h-5 w-5 text-[#747474]" />
                        </CardHeader>
                        <CardContent>
                            <p className="font-poppins text-3xl font-semibold text-black">
                                €{stats.total_sales.toFixed(2)}
                            </p>
                            <p className={cn(VENDOR_MUTED, 'mt-1 text-sm')}>Depuis le début</p>
                        </CardContent>
                    </Card>

                    <Card className={VENDOR_CARD}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h4 className={VENDOR_H4}>Commandes</h4>
                            <ShoppingCart className="h-5 w-5 text-[#747474]" />
                        </CardHeader>
                        <CardContent>
                            <p className="font-poppins text-3xl font-semibold text-black">{stats.total_orders}</p>
                            <p className={cn(VENDOR_MUTED, 'mt-1 text-sm')}>Commandes totales</p>
                        </CardContent>
                    </Card>

                    <Card className={VENDOR_CARD}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h4 className={VENDOR_H4}>Produits</h4>
                            <Package className="h-5 w-5 text-[#747474]" />
                        </CardHeader>
                        <CardContent>
                            <p className="font-poppins text-3xl font-semibold text-black">{stats.total_products}</p>
                            <p className={cn(VENDOR_MUTED, 'mt-1 text-sm')}>En vente</p>
                        </CardContent>
                    </Card>

                    <Card className={VENDOR_CARD}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h4 className={VENDOR_H4}>Clients</h4>
                            <Users className="h-5 w-5 text-[#747474]" />
                        </CardHeader>
                        <CardContent>
                            <p className="font-poppins text-3xl font-semibold text-black">{stats.total_customers}</p>
                            <p className={cn(VENDOR_MUTED, 'mt-1 text-sm')}>Clients uniques (ayant commandé)</p>
                        </CardContent>
                    </Card>
                </div>

                {stats.low_stock_products.length > 0 && (
                    <Alert className="border-l-4 border-[#0059DD] bg-neutral-50 text-black [&>svg]:text-[#0059DD]">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="font-poppins text-base font-normal text-[#747474]">
                            {stats.low_stock_products.length} produit(s) en faible stock (
                            {stats.low_stock_products.map((p) => p.name).join(', ')}). Consultez votre inventaire.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 lg:grid-cols-12">
                    <Card className={cn(VENDOR_CARD, 'lg:col-span-7')}>
                        <CardHeader>
                            <h3 className={VENDOR_H3}>Produits populaires</h3>
                            <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>Vos meilleures ventes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.top_products?.length > 0 ? (
                                    stats.top_products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between border-b border-neutral-100 pb-4 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <p className="font-poppins text-base font-semibold text-black">{product.name}</p>
                                                <p className={VENDOR_MUTED}>€{Number(product.price).toFixed(2)}</p>
                                            </div>
                                            <Badge
                                                className={cn(
                                                    VENDOR_BADGE,
                                                    'bg-[#0059DD] px-3 py-1 text-xs font-semibold text-white hover:bg-[#0047b0]',
                                                )}
                                            >
                                                {product.orders_count} ventes
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className={VENDOR_MUTED}>Aucun produit populaire pour le moment</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={cn(VENDOR_CARD, 'lg:col-span-5')}>
                        <CardHeader>
                            <h3 className={VENDOR_H3}>Accès rapide</h3>
                            <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>Raccourcis</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Link
                                href={route('vendor.products.index')}
                                className="font-poppins inline-flex items-center gap-2 rounded-sm px-3 py-2.5 text-base font-normal text-black hover:bg-neutral-100"
                            >
                                <Package className="h-4 w-4 shrink-0 text-[#747474]" aria-hidden />
                                Mes produits
                            </Link>
                            <Link
                                href={route('vendor.orders.index')}
                                className="font-poppins inline-flex items-center gap-2 rounded-sm px-3 py-2.5 text-base font-normal text-black hover:bg-neutral-100"
                            >
                                <ShoppingCart className="h-4 w-4 shrink-0 text-[#747474]" aria-hidden />
                                Commandes
                            </Link>
                            <Link
                                href={route('vendor.customers.index')}
                                className="font-poppins inline-flex items-center gap-2 rounded-sm px-3 py-2.5 text-base font-normal text-black hover:bg-neutral-100"
                            >
                                <Users className="h-4 w-4 shrink-0 text-[#747474]" aria-hidden />
                                Mes clients
                            </Link>
                            <Link
                                href={route('vendor.settings')}
                                className="font-poppins inline-flex items-center gap-2 rounded-sm px-3 py-2.5 text-base font-normal text-black hover:bg-neutral-100"
                            >
                                <Settings className="h-4 w-4 shrink-0 text-[#747474]" aria-hidden />
                                Paramètres boutique
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {stats.loyal_customers && stats.loyal_customers.length > 0 && (
                    <Card className={VENDOR_CARD}>
                        <CardHeader>
                            <h3 className={VENDOR_H3}>Clients fidèles</h3>
                            <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>
                                Top acheteurs par montant chez vous
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.loyal_customers.map((c) => (
                                    <div
                                        key={c.id}
                                        className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0"
                                    >
                                        <div>
                                            <p className="font-poppins text-base font-semibold text-black">{c.name}</p>
                                            <p className={cn(VENDOR_MUTED, 'text-sm')}>{c.orders_count} commande(s)</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-poppins text-base font-semibold text-black">
                                                €{Number(c.total_spent).toFixed(2)}
                                            </p>
                                            <Link
                                                href={route('vendor.customers.show', c.id)}
                                                className="font-poppins text-sm font-semibold text-[#0059DD] hover:underline"
                                            >
                                                Détails
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className={VENDOR_CARD}>
                    <CardHeader>
                        <h3 className={VENDOR_H3}>Commandes récentes</h3>
                        <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>Vos dernières commandes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recent_orders?.length > 0 ? (
                                stats.recent_orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between border-b border-neutral-100 pb-4 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-poppins text-base font-semibold text-black">Commande #{order.id}</p>
                                            <p className={VENDOR_MUTED}>
                                                {order.customer?.name} · €{Number(order.total_amount).toFixed(2)}
                                            </p>
                                        </div>
                                        <Badge
                                            className={cn(
                                                VENDOR_BADGE,
                                                'bg-neutral-200 px-3 py-1 text-xs font-semibold text-black',
                                            )}
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className={VENDOR_MUTED}>Aucune commande pour le moment</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
