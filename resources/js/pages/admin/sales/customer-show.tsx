import { Head, Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { route } from '@/lib/route';
import { ADMIN_CARD, ADMIN_H3, ADMIN_H4, ADMIN_MUTED } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type OrderItem = {
    product_name: string;
    quantity: number;
    line_total: number;
};

type OrderRow = {
    id: number;
    total: number;
    status: string;
    created_at: string;
    items: OrderItem[];
};

type Props = {
    customer: {
        id: number;
        name: string;
        email: string;
        orders_count: number;
        total_spent: number;
        last_order_at: string | null;
    };
    orders: OrderRow[];
};

function statusBadgeClass(status: string): string {
    switch (status) {
        case 'PAID':
            return 'bg-[#0059DD] text-white';
        case 'PENDING':
            return 'bg-neutral-200 text-black';
        case 'CANCELLED':
            return 'bg-black text-white';
        default:
            return 'bg-neutral-100 text-[#747474]';
    }
}

export default function AdminSalesCustomerShow({ customer, orders }: Props) {
    return (
        <>
            <Head title={`Ventes · ${customer.name}`} />

            <div className="space-y-10">
                <div>
                    <h1 className="font-poppins text-3xl font-semibold text-black">{customer.name}</h1>
                    <p className={cn(ADMIN_MUTED, 'mt-3 text-lg')}>{customer.email}</p>
                    <p className="mt-4 font-poppins text-base font-normal">
                        <Link href={route('admin.sales.customers.index')} className="font-semibold text-[#0059DD] hover:underline">
                            ← Tous les clients
                        </Link>
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className={ADMIN_CARD}>
                        <CardHeader className="pb-2">
                            <h4 className={ADMIN_H4}>Commandes</h4>
                        </CardHeader>
                        <CardContent>
                            <p className="font-poppins text-3xl font-semibold text-black">{customer.orders_count}</p>
                        </CardContent>
                    </Card>
                    <Card className={ADMIN_CARD}>
                        <CardHeader className="pb-2">
                            <h4 className={ADMIN_H4}>Total dépensé</h4>
                        </CardHeader>
                        <CardContent>
                            <p className="font-poppins text-3xl font-semibold text-black">
                                €{Number(customer.total_spent).toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className={ADMIN_CARD}>
                        <CardHeader className="pb-2">
                            <h4 className={ADMIN_H4}>Dernière commande</h4>
                        </CardHeader>
                        <CardContent>
                            <p className="font-poppins text-xl font-semibold text-black">
                                {customer.last_order_at ? new Date(customer.last_order_at).toLocaleString('fr-FR') : '—'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className={ADMIN_CARD}>
                    <CardHeader>
                        <h3 className={ADMIN_H3}>Historique des commandes</h3>
                        <CardDescription className={cn(ADMIN_MUTED, 'text-base')}>
                            Détail des articles et montants
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {orders.length === 0 ? (
                            <p className={ADMIN_MUTED}>Aucune commande.</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="overflow-hidden rounded-sm border border-neutral-200">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50 px-4 py-3 font-poppins text-base">
                                        <span className="font-semibold text-black">Commande #{order.id}</span>
                                        <span className={ADMIN_MUTED}>
                                            {new Date(order.created_at).toLocaleString('fr-FR')}
                                        </span>
                                        <Badge className={cn('px-3 py-1 font-poppins text-xs font-semibold', statusBadgeClass(order.status))}>
                                            {order.status}
                                        </Badge>
                                        <span className="font-semibold text-black">€{Number(order.total).toFixed(2)}</span>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-white hover:bg-white">
                                                <TableHead className={cn(ADMIN_H4, 'text-[#747474]')}>Produit</TableHead>
                                                <TableHead className={cn(ADMIN_H4, 'text-right text-[#747474]')}>Qté</TableHead>
                                                <TableHead className={cn(ADMIN_H4, 'text-right text-[#747474]')}>
                                                    Sous-total
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((it, idx) => (
                                                <TableRow key={`${order.id}-${idx}`} className="border-neutral-100">
                                                    <TableCell className="font-poppins text-black">{it.product_name}</TableCell>
                                                    <TableCell className="text-right font-poppins text-black">{it.quantity}</TableCell>
                                                    <TableCell className="text-right font-poppins font-semibold text-black">
                                                        €{Number(it.line_total).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

