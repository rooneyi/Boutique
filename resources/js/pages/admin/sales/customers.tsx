import { Head, Link } from '@inertiajs/react';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import {
    AdminDataTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    ADMIN_TABLE_CELL,
    ADMIN_TABLE_HEAD,
    ADMIN_TABLE_HEADER_ROW,
    ADMIN_TABLE_ROW,
} from '@/components/admin/admin-table';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_SM_OUTLINE,
    ADMIN_H3,
    ADMIN_MOBILE_META,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
    ADMIN_TABLE_COL_LG,
    ADMIN_TABLE_COL_MD,
} from '@/lib/admin-ui-styles';
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
            <Head title="Clients" />

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHeader
                    title="Clients"
                    description="Vue globale des clients et de leur historique d'achat."
                    actions={
                        <Link href={route('admin.dashboard')} className={ADMIN_BTN_SM_OUTLINE}>
                            Tableau de bord
                        </Link>
                    }
                />

                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>Liste des clients</h3>
                        <AdminCardDescription>
                            {customers.length} client(s) · basé sur l&apos;historique des commandes
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        {customers.length === 0 ? (
                            <p className={cn(ADMIN_MUTED, 'py-12 text-center')}>
                                Aucun client pour le moment.
                            </p>
                        ) : (
                            <AdminDataTable>
                                <TableHeader>
                                    <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                        <TableHead className={ADMIN_TABLE_HEAD}>Client</TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD)}
                                        >
                                            Email
                                        </TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, 'text-right')}
                                        >
                                            Commandes
                                        </TableHead>
                                        <TableHead
                                            className={cn(
                                                ADMIN_TABLE_HEAD,
                                                ADMIN_TABLE_COL_MD,
                                                'text-right',
                                            )}
                                        >
                                            Total dépensé
                                        </TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_LG)}
                                        >
                                            Dernière commande
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((c) => (
                                        <TableRow key={c.id} className={ADMIN_TABLE_ROW}>
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    'font-medium text-neutral-900',
                                                )}
                                            >
                                                {c.name}
                                                <span className={ADMIN_MOBILE_META}>{c.email}</span>
                                                <span className={ADMIN_MOBILE_META}>
                                                    {c.orders_count} cmd. · €
                                                    {Number(c.total_spent).toFixed(2)}
                                                    {c.last_order_at
                                                        ? ` · ${new Date(c.last_order_at).toLocaleDateString('fr-FR')}`
                                                        : ''}
                                                </span>
                                            </TableCell>
                                            <TableCell
                                                className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_MD)}
                                            >
                                                {c.email}
                                            </TableCell>
                                            <TableCell
                                                className={cn(ADMIN_TABLE_CELL, 'text-right')}
                                            >
                                                {c.orders_count}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    ADMIN_TABLE_COL_MD,
                                                    'text-right font-semibold text-neutral-900',
                                                )}
                                            >
                                                €{Number(c.total_spent).toFixed(2)}
                                            </TableCell>
                                            <TableCell
                                                className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_LG)}
                                            >
                                                {c.last_order_at
                                                    ? new Date(c.last_order_at).toLocaleDateString(
                                                          'fr-FR',
                                                      )
                                                    : '—'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </AdminDataTable>
                        )}
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
