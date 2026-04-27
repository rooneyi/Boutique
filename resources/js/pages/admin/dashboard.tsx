import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { TrendingUp, Package, Users, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type AdminStats = {
    total_vendors: number;
    total_customers: number;
    total_products: number;
    total_sales: number;
    total_orders: number;
    avg_order_value: number;
};

export default function AdminDashboard({ stats }: { stats: AdminStats }) {
    return (
        <>
            <Head title="Tableau de Bord Admin" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Admin</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Vue d'ensemble de la plateforme
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Vendeurs */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vendeurs</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_vendors}</div>
                            <p className="text-xs text-muted-foreground">
                                Vendeurs actifs
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
                            <p className="text-xs text-muted-foreground">
                                Clients enregistrés
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

                    {/* Chiffre d'affaires */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Chiffre d'Affaires
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                €{stats.total_sales.toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total
                            </p>
                        </CardContent>
                    </Card>

                    {/* Commandes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="text-xs text-muted-foreground">
                                Total
                            </p>
                        </CardContent>
                    </Card>

                    {/* Panier Moyen */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Panier Moyen
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                €{stats.avg_order_value.toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Par commande
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Rapides */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions Rapides</CardTitle>
                        <CardDescription>Accéder aux sections principales</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={route('admin.vendors.index')}>
                                <Users className="mr-2 h-4 w-4" />
                                Gérer Vendeurs
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={route('admin.customers.index')}>
                                <Users className="mr-2 h-4 w-4" />
                                Gérer Clients
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={route('admin.products.index')}>
                                <Package className="mr-2 h-4 w-4" />
                                Tous les Produits
                            </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                            <Link href={route('admin.products.low-stock')}>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                Stocks Faibles
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Infos Plateforme */}
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        Plateforme multi-vendeur • {stats.total_products} produits actifs • {stats.total_vendors} vendeurs
                    </AlertDescription>
                </Alert>
            </div>
        </>
    );
}
