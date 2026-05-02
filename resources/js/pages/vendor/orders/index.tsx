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

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'PAID':
            return 'default';
        case 'PENDING':
            return 'secondary';
        case 'CANCELLED':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function VendorOrders({ orders }: Props) {
    return (
        <>
            <Head title="Commandes" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Commandes passées sur votre boutique
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Historique</CardTitle>
                        <CardDescription>Produits vendus et statuts de paiement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.data.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead>Articles</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.data.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.id}</TableCell>
                                                <TableCell>{order.customer_name}</TableCell>
                                                <TableCell className="text-right">
                                                    €{order.total.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                                                </TableCell>
                                                <TableCell className="max-w-xs text-sm text-muted-foreground">
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

                <p className="text-sm text-muted-foreground">
                    <Link href={route('vendor.dashboard')} className="underline">
                        Retour au tableau de bord
                    </Link>
                </p>
            </div>
        </>
    );
}
