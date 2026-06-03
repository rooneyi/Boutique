import { Head, Link, router } from '@inertiajs/react';
import { AdminBadge } from '@/components/admin/admin-badge';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { AdminPageHero } from '@/components/admin/admin-page-hero';
import { AdminSalesChart } from '@/components/admin/admin-sales-chart';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_PILL_OUTLINE,
    ADMIN_FILTER_PILL,
    ADMIN_FILTER_PILL_ACTIVE,
    ADMIN_H3,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';
import { BarChart3, ShoppingCart, Wallet } from 'lucide-react';

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
    chart_series: { label: string; revenue: number; orders: number }[];
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

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHero
                    title="Analyse des ventes"
                    description="Indicateurs globaux, période et analyses avancées de la plateforme."
                    actions={
                        <Link href={route('admin.dashboard')} className={ADMIN_BTN_PILL_OUTLINE}>
                            Tableau de bord
                        </Link>
                    }
                />

                <div className="flex flex-wrap gap-2">
                    {(Object.keys(periodLabels) as Period[]).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPeriod(p)}
                            className={period === p ? ADMIN_FILTER_PILL_ACTIVE : ADMIN_FILTER_PILL}
                        >
                            {periodLabels[p]}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AdminStatCard
                        label="Chiffre d'affaires"
                        value={`€${Number(analytics.total_sales).toFixed(2)}`}
                        hint={`Période : ${periodLabels[period]}`}
                        icon={Wallet}
                        accent
                    />
                    <AdminStatCard
                        label="Commandes"
                        value={analytics.total_orders}
                        hint="Nombre de commandes"
                        icon={ShoppingCart}
                    />
                    <AdminStatCard
                        label="Panier moyen"
                        value={`€${Number(analytics.average_order).toFixed(2)}`}
                        hint="Montant moyen par commande"
                        icon={BarChart3}
                    />
                </div>

                <AdminSalesChart
                    data={analytics.chart_series ?? []}
                    periodLabel={periodLabels[period]}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <AdminCard>
                        <AdminCardHeader>
                            <h3 className={ADMIN_H3}>Période la plus forte</h3>
                            <AdminCardDescription>
                                Journée avec le plus de CA sur l&apos;intervalle
                            </AdminCardDescription>
                        </AdminCardHeader>
                        <AdminCardContent className="font-poppins text-sm text-black">
                            {analytics.best_sales_day ? (
                                <ul className="space-y-2">
                                    <li>
                                        <span className="font-semibold">Date :</span>{' '}
                                        {new Date(analytics.best_sales_day.date).toLocaleDateString('fr-FR')}
                                    </li>
                                    <li>
                                        <span className="font-semibold">CA :</span> €
                                        {Number(analytics.best_sales_day.revenue).toFixed(2)}
                                    </li>
                                    <li>
                                        <span className="font-semibold">Commandes :</span>{' '}
                                        {analytics.best_sales_day.orders}
                                    </li>
                                </ul>
                            ) : (
                                <p className={ADMIN_MUTED}>Pas assez de données sur cette période.</p>
                            )}
                        </AdminCardContent>
                    </AdminCard>

                    <AdminCard>
                        <AdminCardHeader>
                            <h3 className={ADMIN_H3}>Ruptures à forte demande</h3>
                            <AdminCardDescription>
                                Produits en rupture les plus vendus sur la période
                            </AdminCardDescription>
                        </AdminCardHeader>
                        <AdminCardContent>
                            {analytics.high_demand_out_of_stock.length > 0 ? (
                                <ul className="space-y-2 font-poppins text-sm">
                                    {analytics.high_demand_out_of_stock.map((row) => (
                                        <li
                                            key={row.id}
                                            className="flex flex-col gap-1 border-b border-neutral-100 pb-2 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
                                        >
                                            <span className="font-medium text-black">{row.name}</span>
                                            <span className={cn(ADMIN_MUTED, 'shrink-0 text-sm')}>
                                                {row.units_sold} unités · {row.vendor}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={ADMIN_MUTED}>Aucune rupture avec ventes sur cette période.</p>
                            )}
                        </AdminCardContent>
                    </AdminCard>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {[
                        { title: 'Produits les plus vendus', rows: analytics.top_products, render: (p: TopProduct) => (
                            <li
                                key={p.id}
                                className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
                            >
                                <span className="min-w-0 truncate">{p.name}</span>
                                <AdminBadge className="self-start sm:self-center" variant="blue">
                                    {p.total_sold}
                                </AdminBadge>
                            </li>
                        )},
                        { title: 'Vendeurs les plus actifs', rows: analytics.top_vendors, render: (v: TopVendor) => (
                            <li
                                key={v.id}
                                className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
                            >
                                <span className="min-w-0 truncate">{v.shop_name}</span>
                                <AdminBadge className="self-start sm:self-center" variant="outline">
                                    {v.orders_count}
                                </AdminBadge>
                            </li>
                        )},
                        { title: 'Clients les plus actifs', rows: analytics.top_customers, render: (c: TopCustomer) => (
                            <li
                                key={c.id}
                                className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
                            >
                                <span className="min-w-0 truncate">{c.name}</span>
                                <AdminBadge className="self-start sm:self-center" variant="outline">
                                    {c.orders_count}
                                </AdminBadge>
                            </li>
                        )},
                    ].map((block) => (
                        <AdminCard key={block.title}>
                            <AdminCardHeader>
                                <h3 className={ADMIN_H3}>{block.title}</h3>
                            </AdminCardHeader>
                            <AdminCardContent className="max-h-80 overflow-auto font-poppins text-sm">
                                {block.rows.length > 0 ? (
                                    <ul className="space-y-3">
                                        {block.rows.map((row) => block.render(row as never))}
                                    </ul>
                                ) : (
                                    <p className={ADMIN_MUTED}>—</p>
                                )}
                            </AdminCardContent>
                        </AdminCard>
                    ))}
                </div>
            </div>
        </>
    );
}
