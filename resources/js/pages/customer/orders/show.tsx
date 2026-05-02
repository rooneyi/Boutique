import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

type Item = {
    product_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
};

type Order = {
    id: number;
    total_amount: number;
    status: string;
    created_at: string;
    vendor: { shop_name: string };
    items: Item[];
};

type Props = {
    order: Order;
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

export default function CustomerOrderShow({ order }: Props) {
    return (
        <>
            <Head title={`Commande #${order.id}`} />

            <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Commande #{order.id}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {order.vendor.shop_name} ·{' '}
                            {new Date(order.created_at).toLocaleString('fr-FR')}
                        </p>
                    </div>
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Articles</CardTitle>
                        <CardDescription>Détail des produits achetés</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead className="text-right">Prix unit.</TableHead>
                                    <TableHead className="text-right">Qté</TableHead>
                                    <TableHead className="text-right">Sous-total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{item.product_name}</TableCell>
                                        <TableCell className="text-right">€{item.unit_price.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">€{item.line_total.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="mt-6 text-right text-lg font-semibold">
                            Total : €{order.total_amount.toFixed(2)}
                        </p>
                    </CardContent>
                </Card>

                <Button variant="outline" asChild>
                    <Link href={route('customer.orders.index')}>Retour aux commandes</Link>
                </Button>
            </div>
        </>
    );
}
