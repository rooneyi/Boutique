import { Head, Link } from '@inertiajs/react';
import { route } from '@/lib/route';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { VENDOR_BTN_PRIMARY, VENDOR_CARD, VENDOR_H1, VENDOR_H3, VENDOR_H4, VENDOR_MUTED } from '@/lib/vendor-ui-styles';
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

export default function VendorCustomers({ customers }: Props) {
    return (
        <>
            <Head title="Mes clients" />

            <div className="space-y-10">
                <div>
                    <h1 className={VENDOR_H1}>Clients</h1>
                    <p className={cn(VENDOR_MUTED, 'mt-3 max-w-xl')}>
                        Clients ayant commandé chez vous — fréquence et montant total.
                    </p>
                </div>

                <Card className={VENDOR_CARD}>
                    <CardHeader>
                        <h3 className={VENDOR_H3}>Liste des clients</h3>
                        <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>
                            Basée sur l’historique des commandes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {customers.length === 0 ? (
                            <p className={VENDOR_MUTED}>Aucun client pour le moment.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-sm border border-neutral-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Client</TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Email</TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-right text-[#747474]')}>
                                                Commandes
                                            </TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-right text-[#747474]')}>
                                                Total dépensé
                                            </TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>
                                                Dernière commande
                                            </TableHead>
                                            <TableHead className={cn(VENDOR_H4, 'text-right text-[#747474]')}>
                                                Détails
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.map((c) => (
                                            <TableRow key={c.id} className="border-neutral-100">
                                                <TableCell className="font-poppins font-semibold text-black">{c.name}</TableCell>
                                                <TableCell className={cn(VENDOR_MUTED, 'text-sm')}>{c.email}</TableCell>
                                                <TableCell className="text-right font-poppins text-black">{c.orders_count}</TableCell>
                                                <TableCell className="text-right font-poppins font-semibold text-black">
                                                    €{Number(c.total_spent).toFixed(2)}
                                                </TableCell>
                                                <TableCell className={cn(VENDOR_MUTED, 'text-sm')}>
                                                    {c.last_order_at
                                                        ? new Date(c.last_order_at).toLocaleDateString('fr-FR')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={route('vendor.customers.show', c.id)}
                                                        className={cn(VENDOR_BTN_PRIMARY, 'py-2 pl-4 pr-4')}
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
                    <Link href={route('vendor.dashboard')} className="font-semibold text-[#0059DD] hover:underline">
                        ← Tableau de bord
                    </Link>
                </p>
            </div>
        </>
    );
}
