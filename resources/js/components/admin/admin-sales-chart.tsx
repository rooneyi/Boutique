import { useMemo } from 'react';
import {
    Area,
    Bar,
    CartesianGrid,
    ComposedChart,
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

type NormalizedPoint = ChartPoint & { revenue: number; orders: number };

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

function normalizeData(data: ChartPoint[]): NormalizedPoint[] {
    return data.map((point) => ({
        ...point,
        revenue: Number(point.revenue) || 0,
        orders: Number(point.orders) || 0,
    }));
}

/** Plafond d'axe avec marge haute pour que la courbe ne colle pas au bord. */
function axisTop(values: number[], paddingRatio = 0.18, floor = 1): number {
    const max = Math.max(0, ...values);
    if (max <= 0) {
        return floor;
    }

    const padded = max * (1 + paddingRatio);
    return max >= 10 ? Math.ceil(padded) : Math.ceil(padded * 10) / 10;
}

type TooltipProps = {
    active?: boolean;
    payload?: { name: string; value: number; color: string }[];
    label?: string;
};

function CustomTooltip({ active, payload, label }: TooltipProps) {
    if (!active || !payload?.length) {
        return null;
    }

    const revenue = payload.find((p) => p.name === 'revenue');
    const orders = payload.find((p) => p.name === 'orders');

    return (
        <div className="min-w-[160px] rounded-xl border border-neutral-100 bg-white p-3 shadow-lg">
            <p className="mb-2 font-poppins text-xs font-semibold tracking-wide text-[#747474] uppercase">
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
    const series = useMemo(() => normalizeData(data), [data]);
    const hasData = series.some((point) => point.revenue > 0 || point.orders > 0);

    const revenueMax = useMemo(() => axisTop(series.map((p) => p.revenue)), [series]);
    const ordersMax = useMemo(
        () => Math.max(1, Math.ceil(axisTop(series.map((p) => p.orders), 0.25, 1))),
        [series],
    );

    const barSize = Math.max(10, Math.min(36, Math.floor(520 / Math.max(series.length, 1))));
    const showDots = series.length <= 16;

    return (
        <AdminCard className="overflow-hidden">
            <AdminCardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h3 className={ADMIN_H3}>Évolution des ventes</h3>
                    <AdminCardDescription>
                        Chiffre d&apos;affaires et volume de commandes — {periodLabel}
                    </AdminCardDescription>
                </div>
                {hasData && (
                    <div className="flex items-center gap-5 font-poppins text-xs">
                        <span className="flex items-center gap-1.5 text-[#444]">
                            <span className="inline-block h-0.5 w-5 rounded-full bg-[#0059DD]" />
                            Chiffre d&apos;affaires
                        </span>
                        <span className="flex items-center gap-1.5 text-[#444]">
                            <span className="inline-block size-2.5 rounded-sm bg-[#00C49F]/40" />
                            Commandes
                        </span>
                    </div>
                )}
            </AdminCardHeader>

            <AdminCardContent className="pb-2">
                {hasData ? (
                    <div className="mx-auto h-[340px] w-full min-w-0 max-w-full">
                        <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={series}
                            margin={{ top: 16, right: 20, left: 12, bottom: 8 }}
                            barCategoryGap="20%"
                        >
                            <defs>
                                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0059DD" stopOpacity={0.22} />
                                    <stop offset="100%" stopColor="#0059DD" stopOpacity={0.02} />
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
                                interval={series.length > 10 ? 'preserveStartEnd' : 0}
                                minTickGap={series.length > 10 ? 24 : 8}
                                padding={{ left: 24, right: 24 }}
                                tick={{
                                    fontSize: 11,
                                    fontFamily: 'Poppins, sans-serif',
                                    fill: '#9ca3af',
                                }}
                            />

                            <YAxis
                                yAxisId="left"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={56}
                                domain={[0, revenueMax]}
                                allowDataOverflow={false}
                                tickFormatter={formatMoney}
                                tick={{
                                    fontSize: 11,
                                    fontFamily: 'Poppins, sans-serif',
                                    fill: '#9ca3af',
                                }}
                            />

                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={28}
                                domain={[0, ordersMax]}
                                allowDecimals={false}
                                allowDataOverflow={false}
                                tick={{
                                    fontSize: 11,
                                    fontFamily: 'Poppins, sans-serif',
                                    fill: '#9ca3af',
                                }}
                            />

                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(0, 89, 221, 0.06)' }}
                            />

                            <Bar
                                yAxisId="right"
                                dataKey="orders"
                                name="orders"
                                fill="#00C49F"
                                fillOpacity={0.35}
                                radius={[4, 4, 0, 0]}
                                barSize={barSize}
                                isAnimationActive={false}
                            />

                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                name="revenue"
                                stroke="#0059DD"
                                strokeWidth={2.5}
                                fill="url(#gradRevenue)"
                                baseValue={0}
                                connectNulls
                                isAnimationActive={false}
                                dot={
                                    showDots
                                        ? {
                                              r: 3.5,
                                              fill: '#0059DD',
                                              stroke: '#fff',
                                              strokeWidth: 1.5,
                                          }
                                        : false
                                }
                                activeDot={{ r: 5, fill: '#0059DD', strokeWidth: 0 }}
                            />
                        </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex h-[340px] flex-col items-center justify-center gap-3">
                        <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100">
                            <svg
                                className="size-7 text-neutral-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                                />
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
