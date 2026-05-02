import { Head, Link } from '@inertiajs/react';
import { route } from '@/lib/route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type CustomerRow = {
    id: number;
    name: string;
    email: string;
    orders_count: number;
    total_spent: number;
    last_order_at: string | null;
};

type Props = {
    customers: CustomerRow[];
};

export default function VendorCustomers({ customers }: Props) {
    return (
        <>
            <Head title="Mes clients" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Mes clients</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Clients ayant commandé chez vous — fréquence et montant total
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des clients</CardTitle>
                        <CardDescription>Basée sur l’historique des commandes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {customers.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Aucun client pour le moment.</p>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="text-right">Commandes</TableHead>
                                            <TableHead className="text-right">Total dépensé</TableHead>
                                            <TableHead>Dernière commande</TableHead>
                                            <TableHead className="text-right">Détails</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell className="font-medium">{c.name}</TableCell>
                                                <TableCell className="text-muted-foreground text-sm">{c.email}</TableCell>
                                                <TableCell className="text-right">{c.orders_count}</TableCell>
                                                <TableCell className="text-right">
                                                    €{Number(c.total_spent).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {c.last_order_at
                                                        ? new Date(c.last_order_at).toLocaleDateString('fr-FR')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={route('vendor.customers.show', c.id)}>
                                                            Historique
                                                        </Link>
                                                    </Button>
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
