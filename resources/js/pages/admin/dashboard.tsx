import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Package, Users, ShoppingCart, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { route } from '@/lib/route';

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

export default function AdminDashboard({ stats }: { stats: AdminStats }) {
    return (
        <>
            <Head title="Tableau de Bord" />

            <div className="space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Bienvenue, Admin ! Vue d'ensemble de votre boutique.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" asChild>
                            <Link href={route('admin.analytics.sales')}>Analyse des ventes</Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('admin.products.index')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Catalogue produits
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">€{stats.total_sales.toFixed(2)}</div>
                            <p className="mt-2 text-xs text-muted-foreground">+12.5% par rapport à la semaine dernière</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commandes Récentes</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="mt-2 text-xs text-muted-foreground">Commandes traitées</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produits Actifs</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            <p className="mt-2 text-xs text-muted-foreground">Produits disponibles</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Nouveaux Clients</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.new_customers}</div>
                            <p className="mt-2 text-xs text-muted-foreground">Derniers 7 jours</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Vue d'ensemble des Ventes</CardTitle>
                            <CardDescription>Performance des ventes sur les derniers jours</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-2xl border border-muted/10 bg-muted p-4">
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="h-24 rounded-full bg-primary/10" />
                                    <div className="h-28 rounded-full bg-primary/20" />
                                    <div className="h-20 rounded-full bg-primary/30" />
                                    <div className="h-32 rounded-full bg-primary/20" />
                                    <div className="h-16 rounded-full bg-primary/10" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Lun</span>
                                <span>Mar</span>
                                <span>Mer</span>
                                <span>Jeu</span>
                                <span>Ven</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Produits Populaires</CardTitle>
                            <CardDescription>Top 5 meilleures ventes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats.top_products.length > 0 ? (
                                stats.top_products.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between gap-4 rounded-xl border p-3">
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">Stock : {product.stock}</p>
                                        </div>
                                        <Badge variant="outline">{product.total_sold} vendus</Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun produit populaire pour le moment.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Commandes Récentes</CardTitle>
                        <CardDescription>Les dernières commandes enregistrées</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recent_orders.length > 0 ? (
                                stats.recent_orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="grid grid-cols-12 gap-4 rounded-xl border p-4 text-sm"
                                    >
                                        <div className="col-span-2 font-medium">#{order.id}</div>
                                        <div className="col-span-3 text-muted-foreground">{order.customer_name}</div>
                                        <div className="col-span-3 text-muted-foreground">{order.created_at}</div>
                                        <div className="col-span-2 font-medium">€{order.total.toFixed(2)}</div>
                                        <div className="col-span-2">
                                            <Badge variant="secondary">{order.status}</Badge>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune commande récente pour le moment.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
