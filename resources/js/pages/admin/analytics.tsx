import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { route } from '@/lib/route';

type Period = 'day' | 'week' | 'month' | 'year';

type TopProduct = { id: number; name: string; price: number; stock: number; total_sold: number };
type TopVendor = { id: number; shop_name: string; owner_name: string; orders_count: number };
type TopCustomer = { id: number; name: string; email: string; orders_count: number };
type BestDay = { date: string; revenue: number; orders: number } | null;
type DemandRow = { id: number; name: string; units_sold: number; vendor: string };

type Analytics = {
    period: Period;
    total_sales: number;
    total_orders: number;
    average_order: number;
    top_products: TopProduct[];
    top_vendors: TopVendor[];
    top_customers: TopCustomer[];
    best_sales_day: BestDay;
    high_demand_out_of_stock: DemandRow[];
};

type Props = {
    period: Period;
    analytics: Analytics;
};

const periodLabels: Record<Period, string> = {
    day: 'Jour',
    week: 'Semaine',
    month: 'Mois',
    year: 'Année',
};

export default function AdminAnalytics({ period, analytics }: Props) {
    const setPeriod = (p: Period) => {
        router.get(route('admin.analytics.sales'), { period: p }, { preserveState: true, replace: true });
    };

    return (
        <>
            <Head title="Analyse des ventes" />

            <div className="space-y-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analyse des ventes</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Indicateurs globaux, période et analyses avancées (cahier des charges)
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route('admin.dashboard')}>Tableau de bord</Link>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(Object.keys(periodLabels) as Period[]).map((p) => (
                        <Button key={p} variant={period === p ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(p)}>
                            {periodLabels[p]}
                        </Button>
                    ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Chiffre d&apos;affaires</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">€{Number(analytics.total_sales).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Période : {periodLabels[period]}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{analytics.total_orders}</p>
                            <p className="text-xs text-muted-foreground">Nombre de commandes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">€{Number(analytics.average_order).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Montant moyen par commande</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Période la plus forte</CardTitle>
                            <CardDescription>Journée avec le plus de CA sur l&apos;intervalle sélectionné</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analytics.best_sales_day ? (
                                <div className="space-y-1 text-sm">
                                    <p>
                                        <span className="font-medium">Date :</span>{' '}
                                        {new Date(analytics.best_sales_day.date).toLocaleDateString('fr-FR')}
                                    </p>
                                    <p>
                                        <span className="font-medium">CA :</span> €
                                        {Number(analytics.best_sales_day.revenue).toFixed(2)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Commandes :</span> {analytics.best_sales_day.orders}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Pas assez de données sur cette période.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ruptures à forte demande</CardTitle>
                            <CardDescription>Produits en rupture avec le plus d&apos;unités vendues sur la période</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {analytics.high_demand_out_of_stock.length > 0 ? (
                                <ul className="space-y-2 text-sm">
                                    {analytics.high_demand_out_of_stock.map((row) => (
                                        <li key={row.id} className="flex justify-between gap-2 border-b border-muted/40 pb-2 last:border-0">
                                            <span className="font-medium">{row.name}</span>
                                            <span className="text-muted-foreground">
                                                {row.units_sold} unités · {row.vendor}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucune rupture avec ventes sur cette période.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Produits les plus vendus</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-80 overflow-auto text-sm">
                            {analytics.top_products.length > 0 ? (
                                <ul className="space-y-2">
                                    {analytics.top_products.map((p) => (
                                        <li key={p.id} className="flex justify-between gap-2">
                                            <span>{p.name}</span>
                                            <Badge variant="outline">{p.total_sold}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">—</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Vendeurs les plus actifs</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-80 overflow-auto text-sm">
                            {analytics.top_vendors.length > 0 ? (
                                <ul className="space-y-2">
                                    {analytics.top_vendors.map((v) => (
                                        <li key={v.id} className="flex justify-between gap-2">
                                            <span>{v.shop_name}</span>
                                            <Badge variant="secondary">{v.orders_count}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">—</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-1">
                        <CardHeader>
                            <CardTitle>Clients les plus actifs</CardTitle>
                        </CardHeader>
                        <CardContent className="max-h-80 overflow-auto text-sm">
                            {analytics.top_customers.length > 0 ? (
                                <ul className="space-y-2">
                                    {analytics.top_customers.map((c) => (
                                        <li key={c.id} className="flex justify-between gap-2">
                                            <span className="truncate">{c.name}</span>
                                            <Badge variant="secondary">{c.orders_count}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">—</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
