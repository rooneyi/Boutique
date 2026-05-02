import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export default function VendorCustomerShow({ customer, orders }: Props) {
    return (
        <>
            <Head title={`Client · ${customer.name}`} />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
                    <p className="mt-4 text-sm">
                        <Link href={route('vendor.customers.index')} className="text-primary underline">
                            ← Tous les clients
                        </Link>
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{customer.orders_count}</p>
                            <p className="text-xs text-muted-foreground">Fréquence (chez vous)</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total dépensé</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">€{Number(customer.total_spent).toFixed(2)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Dernière commande</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold">
                                {customer.last_order_at
                                    ? new Date(customer.last_order_at).toLocaleString('fr-FR')
                                    : '—'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Historique des commandes</CardTitle>
                        <CardDescription>Produits, quantités et montants pour votre boutique</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {orders.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucune commande.</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="rounded-lg border">
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-4 py-3 text-sm">
                                        <span className="font-medium">Commande #{order.id}</span>
                                        <span className="text-muted-foreground">
                                            {new Date(order.created_at).toLocaleString('fr-FR')}
                                        </span>
                                        <Badge variant="secondary">{order.status}</Badge>
                                        <span className="font-semibold">€{Number(order.total).toFixed(2)}</span>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Produit</TableHead>
                                                <TableHead className="text-right">Qté</TableHead>
                                                <TableHead className="text-right">Sous-total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {order.items.map((it, idx) => (
                                                <TableRow key={`${order.id}-${idx}`}>
                                                    <TableCell>{it.product_name}</TableCell>
                                                    <TableCell className="text-right">{it.quantity}</TableCell>
                                                    <TableCell className="text-right">
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
