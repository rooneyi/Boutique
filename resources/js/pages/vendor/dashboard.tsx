import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Package, Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { route } from '@/lib/route';

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

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Bienvenue sur votre espace vendeur
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('vendor.products.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Produit
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Ventes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                €{stats.total_sales.toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Depuis le début
                            </p>
                        </CardContent>
                    </Card>

                    {/* Commandes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="text-xs text-muted-foreground">
                                Commandes totales
                            </p>
                        </CardContent>
                    </Card>

                    {/* Produits */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produits</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            <p className="text-xs text-muted-foreground">
                                En vente
                            </p>
                        </CardContent>
                    </Card>

                    {/* Clients */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clients</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_customers}</div>
                            <p className="text-xs text-muted-foreground">Clients uniques (ayant commandé)</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts */}
                {stats.low_stock_products.length > 0 && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {stats.low_stock_products.length} produit(s) en faible stock (
                            {stats.low_stock_products.map((p) => p.name).join(', ')}). Consultez votre inventaire.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Contenu Principal */}
                <div className="grid gap-4 lg:grid-cols-7">
                    {/* Produits Populaires */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Produits Populaires</CardTitle>
                            <CardDescription>Vos meilleures ventes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.top_products?.length > 0 ? (
                                    stats.top_products.map((product: any, index: number) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between border-b pb-4 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    €{Number(product.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {product.orders_count} ventes
                                            </Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Aucun produit populaire pour le moment
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions Rapides */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Actions Rapides</CardTitle>
                            <CardDescription>Accès rapide</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full justify-start" variant="ghost" asChild>
                                <Link href={route('vendor.products.index')}>
                                    Mes Produits
                                </Link>
                            </Button>
                            <Button className="w-full justify-start" variant="ghost" asChild>
                                <Link href={route('vendor.orders.index')}>
                                    Commandes
                                </Link>
                            </Button>
                            <Button className="w-full justify-start" variant="ghost" asChild>
                                <Link href={route('vendor.customers.index')}>
                                    Mes Clients
                                </Link>
                            </Button>
                            <Button className="w-full justify-start" variant="ghost" asChild>
                                <Link href={route('vendor.settings')}>
                                    Paramètres Boutique
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {stats.loyal_customers && stats.loyal_customers.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Clients fidèles</CardTitle>
                            <CardDescription>Top acheteurs par montant chez vous</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.loyal_customers.map((c) => (
                                    <div key={c.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                        <div>
                                            <p className="font-medium">{c.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {c.orders_count} commande(s)
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">€{Number(c.total_spent).toFixed(2)}</p>
                                            <Button variant="link" className="h-auto p-0 text-xs" asChild>
                                                <Link href={route('vendor.customers.show', c.id)}>Détails</Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Commandes Récentes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Commandes Récentes</CardTitle>
                        <CardDescription>Vos dernières commandes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recent_orders?.length > 0 ? (
                                stats.recent_orders.map((order: any) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">Commande #{order.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.customer?.name} · €{Number(order.total_amount).toFixed(2)}
                                            </p>
                                        </div>
                                        <Badge>{order.status}</Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Aucune commande pour le moment
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
