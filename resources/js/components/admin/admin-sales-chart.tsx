import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from 'recharts';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { ADMIN_H3, ADMIN_MUTED } from '@/lib/admin-ui-styles';

export type ChartPoint = {
    label: string;
    revenue: number;
    orders: number;
};

const chartConfig = {
    revenue: {
        label: "Chiffre d'affaires",
        color: '#0059DD',
    },
    orders: {
        label: 'Commandes',
        color: 'hsl(var(--chart-2))',
    },
} satisfies ChartConfig;

type Props = {
    data: ChartPoint[];
    periodLabel: string;
};

function formatEuro(value: number) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(value);
}

export function AdminSalesChart({ data, periodLabel }: Props) {
    const hasData = data.some((d) => d.revenue > 0 || d.orders > 0);

    return (
        <AdminCard className="overflow-hidden">
            <AdminCardHeader>
                <h3 className={ADMIN_H3}>Évolution des ventes</h3>
                <AdminCardDescription>
                    Chiffre d&apos;affaires et volume de commandes — {periodLabel}
                </AdminCardDescription>
            </AdminCardHeader>
            <AdminCardContent>
                {hasData ? (
                    <ChartContainer config={chartConfig} className="h-[min(360px,50vh)] w-full">
                        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-neutral-200/80" />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                minTickGap={24}
                                className="font-poppins text-[11px]"
                            />
                            <YAxis
                                yAxisId="left"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={56}
                                tickFormatter={(v) => `${Math.round(Number(v))}€`}
                                className="font-poppins text-[11px]"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                width={36}
                                allowDecimals={false}
                                className="font-poppins text-[11px]"
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(_, payload) => {
                                            const row = payload?.[0]?.payload as ChartPoint | undefined;
                                            return row?.label ?? '';
                                        }}
                                        formatter={(value, name) => {
                                            if (name === 'revenue') {
                                                return (
                                                    <span className="font-mono font-medium tabular-nums">
                                                        {formatEuro(Number(value))}
                                                    </span>
                                                );
                                            }
                                            return (
                                                <span className="font-mono font-medium tabular-nums">
                                                    {Number(value).toLocaleString('fr-FR')}
                                                </span>
                                            );
                                        }}
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--color-revenue)"
                                strokeWidth={2}
                                fill="url(#fillRevenue)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                            <Bar
                                yAxisId="right"
                                dataKey="orders"
                                fill="var(--color-orders)"
                                fillOpacity={0.85}
                                radius={[4, 4, 0, 0]}
                                barSize={data.length > 20 ? 8 : 14}
                                maxBarSize={18}
                            />
                        </ComposedChart>
                    </ChartContainer>
                ) : (
                    <p className={ADMIN_MUTED}>
                        Pas encore de ventes sur cette période. Les graphiques s&apos;afficheront dès
                        les premières commandes.
                    </p>
                )}
            </AdminCardContent>
        </AdminCard>
    );
}
