import { Head, Link } from '@inertiajs/react';
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

export default function AdminSalesCustomers({ customers }: Props) {
    return (
        <>
            <Head title="Ventes · Clients" />

            <div className="space-y-10">
                <div>
                    <h1 className="font-poppins text-3xl font-semibold text-black">Clients</h1>
                    <p className={cn(ADMIN_MUTED, 'mt-3 max-w-xl')}>
                        Vue globale des clients et de leur historique d’achat.
                    </p>
                </div>

                <Card className={ADMIN_CARD}>
                    <CardHeader>
                        <h3 className={ADMIN_H3}>Liste des clients</h3>
                        <CardDescription className={cn(ADMIN_MUTED, 'text-base')}>
                            Basée sur l’historique des commandes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {customers.length === 0 ? (
                            <p className={ADMIN_MUTED}>Aucun client pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-sm border border-neutral-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
                                            <TableHead className={cn(ADMIN_H4, 'text-[#747474]')}>Client</TableHead>
                                            <TableHead className={cn(ADMIN_H4, 'text-[#747474]')}>Email</TableHead>
                                            <TableHead className={cn(ADMIN_H4, 'text-right text-[#747474]')}>
                                                Commandes
                                            </TableHead>
                                            <TableHead className={cn(ADMIN_H4, 'text-right text-[#747474]')}>
                                                Total dépensé
                                            </TableHead>
                                            <TableHead className={cn(ADMIN_H4, 'text-[#747474]')}>
                                                Dernière commande
                                            </TableHead>
                                            <TableHead className={cn(ADMIN_H4, 'text-right text-[#747474]')}>
                                                Détails
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.map((c) => (
                                            <TableRow key={c.id} className="border-neutral-100">
                                                <TableCell className="font-poppins font-semibold text-black">{c.name}</TableCell>
                                                <TableCell className={cn(ADMIN_MUTED, 'text-sm')}>{c.email}</TableCell>
                                                <TableCell className="text-right font-poppins text-black">{c.orders_count}</TableCell>
                                                <TableCell className="text-right font-poppins font-semibold text-black">
                                                    €{Number(c.total_spent).toFixed(2)}
                                                </TableCell>
                                                <TableCell className={cn(ADMIN_MUTED, 'text-sm')}>
                                                    {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString('fr-FR') : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={route('admin.sales.customers.show', c.id)}
                                                        className="inline-flex rounded-[32px] border border-black bg-black px-4 py-2 font-poppins text-sm font-semibold text-white hover:bg-neutral-800"
                                                    >
                                                        Historique
                                                    </Link>
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
                    <Link href={route('admin.dashboard')} className="font-semibold text-[#0059DD] hover:underline">
                        ← Tableau de bord
                    </Link>
                </p>
            </div>
        </>
    );
}

