import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { route } from '@/lib/route';
import { VENDOR_BADGE, VENDOR_CARD, VENDOR_H1, VENDOR_H3, VENDOR_H4, VENDOR_MUTED } from '@/lib/vendor-ui-styles';
import { cn } from '@/lib/utils';

type OrderItem = {
    product_name: string;
    quantity: number;
    line_total: number;
};

type Order = {
    id: number;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
    items: OrderItem[];
};

type Props = {
    orders: {
        data: Order[];
    };
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

export default function VendorOrders({ orders }: Props) {
    return (
        <>
            <Head title="Commandes" />

            <div className="space-y-10">
                <div>
                    <h1 className={VENDOR_H1}>Commandes</h1>
                    <p className={cn(VENDOR_MUTED, 'mt-3 max-w-xl')}>Commandes passées sur votre boutique.</p>
                </div>

                <Card className={VENDOR_CARD}>
                    <CardHeader>
                        <h3 className={VENDOR_H3}>Historique</h3>
                        <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>
                            Produits vendus et statuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.data.length === 0 ? (
                            <p className={VENDOR_MUTED}>Aucune commande pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-sm border border-neutral-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>#</TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Client</TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-right text-[#747474]')}>Total</TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Date</TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Statut</TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Articles</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.data.map((order) => (
                                            <TableRow key={order.id} className="border-neutral-100">
                                                <TableCell className="font-poppins font-semibold text-black">#{order.id}</TableCell>
                                                <TableCell className="font-poppins text-black">{order.customer_name}</TableCell>
                                                <TableCell className="text-right font-poppins font-semibold text-black">
                                                    €{Number(order.total).toFixed(2)}
                                                </TableCell>
                                                <TableCell className={cn(VENDOR_MUTED, 'text-sm')}>
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={cn(
                                                            VENDOR_BADGE,
                                                            'px-3 py-1 font-poppins text-xs font-semibold',
                                                            statusBadgeClass(order.status),
                                                        )}
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-xs font-poppins text-sm font-normal text-[#747474]">
                                                    {order.items.map((i) => `${i.product_name} ×${i.quantity}`).join(', ')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="font-poppins text-base font-normal">
                    <Link href={route('vendor.dashboard')} className="font-semibold text-[#0059DD] hover:underline">
                        ← Tableau de bord
                    </Link>
                </p>
            </div>
        </>
    );
}
