import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { ADMIN_H3, ADMIN_MUTED } from '@/lib/admin-ui-styles';

export type ChartPoint = {
    label: string;
    revenue: number;
    orders: number;
};

type Props = {
    data: ChartPoint[];
    periodLabel: string;
};

function formatMoney(value: number) {
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${Math.round(value)}`;
}

function formatMoneyFull(value: number) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    }).format(value);
}

type TooltipProps = {
    active?: boolean;
    payload?: { name: string; value: number; color: string }[];
    label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload?.length) return null;

    const revenue = payload.find((p) => p.name === 'revenue');
    const orders = payload.find((p) => p.name === 'orders');

    return (
        <div className="min-w-[160px] rounded-xl border border-neutral-100 bg-white p-3 shadow-lg">
            <p className="mb-2 font-poppins text-xs font-semibold text-[#747474] uppercase tracking-wide">
                {label}
            </p>
            {revenue && (
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 font-poppins text-xs text-[#444]">
                        <span className="size-2 rounded-full bg-[#0059DD]" />
                        CA
                    </span>
                    <span className="font-poppins text-sm font-semibold text-black">
                        {formatMoneyFull(revenue.value)}
                    </span>
                </div>
            )}
            {orders && (
                <div className="mt-1 flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 font-poppins text-xs text-[#444]">
                        <span className="size-2 rounded-full bg-[#00C49F]" />
                        Commandes
                    </span>
                    <span className="font-poppins text-sm font-semibold text-black">
                        {orders.value}
                    </span>
                </div>
            )}
        </div>
    );
}

export function AdminSalesChart({ data, periodLabel }: Props) {
    const hasData = data.some((d) => d.revenue > 0 || d.orders > 0);

    const avgRevenue =
        hasData && data.length > 0
            ? data.reduce((s, d) => s + d.revenue, 0) / data.filter((d) => d.revenue > 0).length
            : 0;

    return (
        <AdminCard className="overflow-hidden">
            <AdminCardHeader className="pb-2">
                <div>
                    <h3 className={ADMIN_H3}>Évolution des ventes</h3>
                    <AdminCardDescription>
                        Chiffre d&apos;affaires et volume de commandes — {periodLabel}
                    </AdminCardDescription>
                </div>
                {hasData && (
                    <div className="flex items-center gap-5 text-xs font-poppins">
                        <span className="flex items-center gap-1.5 text-[#444]">
                            <span className="inline-block h-0.5 w-5 rounded-full bg-[#0059DD]" />
                            Chiffre d'affaires
                        </span>
                        <span className="flex items-center gap-1.5 text-[#444]">
                            <span className="inline-block h-0.5 w-5 rounded-full bg-[#00C49F]" />
                            Commandes
                        </span>
                    </div>
                )}
            </AdminCardHeader>

            <AdminCardContent className="pb-4 pr-2">
                {hasData ? (
                    <ResponsiveContainer width="100%" height={340}>
                        <ComposedChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 4 }}>
                            <defs>
                                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0059DD" stopOpacity={0.18} />
                                    <stop offset="100%" stopColor="#0059DD" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00C49F" stopOpacity={0.14} />
                                    <stop offset="100%" stopColor="#00C49F" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                strokeOpacity={0.8}
                            />

                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                interval={data.length > 8 ? 'preserveStartEnd' : 0}
                                minTickGap={data.length > 8 ? 20 : 8}
                                tick={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', fill: '#9ca3af' }}
                            />

                            <YAxis
                                yAxisId="left"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={58}
                                tickFormatter={formatMoney}
                                tick={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', fill: '#9ca3af' }}
                            />

                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={32}
                                allowDecimals={false}
                                tick={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', fill: '#9ca3af' }}
                            />

                            {avgRevenue > 0 && (
                                <ReferenceLine
                                    yAxisId="left"
                                    y={avgRevenue}
                                    stroke="#0059DD"
                                    strokeDasharray="4 4"
                                    strokeOpacity={0.35}
                                />
                            )}

                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />

                            {/* Aire CA */}
                            <Area
                                yAxisId="left"
                                type="monotoneX"
                                dataKey="revenue"
                                stroke="#0059DD"
                                strokeWidth={2.5}
                                fill="url(#gradRevenue)"
                                dot={false}
                                activeDot={{ r: 5, fill: '#0059DD', strokeWidth: 0 }}
                            />

                            {/* Ligne commandes */}
                            <Line
                                yAxisId="right"
                                type="monotoneX"
                                dataKey="orders"
                                stroke="#00C49F"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: '#00C49F', strokeWidth: 0 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-[340px] flex-col items-center justify-center gap-3">
                        <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100">
                            <svg className="size-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                        </div>
                        <p className="font-poppins text-sm text-[#747474]">
                            Pas encore de données sur cette période.
                        </p>
                        <p className="font-poppins text-xs text-neutral-400">
                            Les graphiques apparaîtront dès les premières commandes.
                        </p>
                    </div>
                )}
            </AdminCardContent>
        </AdminCard>
    );
}
