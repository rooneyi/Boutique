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
import { Eye } from 'lucide-react';

type Order = {
    id: number;
    total_amount: number;
    status: string;
    created_at: string;
    items?: any[];
};

type Props = {
    orders: {
        data: Order[];
    };
};

export default function Orders({ orders }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Mes Commandes" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes Commandes</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Historique de vos achats et suivi
                    </p>
                </div>

                {/* Tableaux des Commandes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Commandes</CardTitle>
                        <CardDescription>
                            Retrouvez toutes vos commandes et leur statut
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Commande</TableHead>
                                            <TableHead className="text-right">
                                                Montant
                                            </TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.data.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    #{order.id}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    €{order.total_amount.toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(order.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusVariant(order.status)}>
                                                        {order.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                'customer.orders.show',
                                                                order.id
                                                            )}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                <p>Vous n'avez pas encore de commandes.</p>
                                <Button className="mt-4" asChild>
                                    <Link href={route('customer.products.index')}>
                                        Commencer à Acheter
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
