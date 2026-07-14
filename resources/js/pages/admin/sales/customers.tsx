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
    ADMIN_TABLE_COL_ACTION,
    ADMIN_TABLE_COL_LG,
    ADMIN_TABLE_COL_MD,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type CustomerRow = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    orders_count: number;
    favorites_count: number;
    total_spent: number;
    last_order_at: string | null;
    member_since: string | null;
};

type Props = {
    customers: CustomerRow[];
};

function CustomerAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');

    return (
        <div className="size-9 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
            {avatarUrl ? (
                <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
                <div className="flex size-full items-center justify-center text-xs font-semibold text-neutral-600">
                    {initials || '?'}
                </div>
            )}
        </div>
    );
}

export default function AdminSalesCustomers({ customers }: Props) {
    return (
        <>
            <Head title="Clients" />

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHeader
                    title="Clients"
                    description="Profils clients : contact, inscription, achats et engagement."
                    actions={
                        <Link href={route('admin.dashboard')} className={ADMIN_BTN_SM_OUTLINE}>
                            Tableau de bord
                        </Link>
                    }
                />

                <AdminCard className="!p-0 overflow-hidden">
                    <AdminCardHeader className="mb-0 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
                        <h3 className={cn(ADMIN_H3, 'text-xl sm:text-2xl lg:text-2xl')}>
                            Liste des clients
                        </h3>
                        <AdminCardDescription className="text-sm">
                            {customers.length} client(s) · cliquez « Voir » ou le nom pour le profil
                            et les adresses
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        {customers.length === 0 ? (
                            <p className={cn(ADMIN_MUTED, 'px-5 py-12 text-center sm:px-6')}>
                                Aucun client pour le moment.
                            </p>
                        ) : (
                            <AdminDataTable className="!mx-0 border-x-0 border-b-0 !rounded-none">
                                <TableHeader>
                                    <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                        <TableHead className={ADMIN_TABLE_HEAD}>Client</TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD)}
                                        >
                                            Contact
                                        </TableHead>
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD)}
                                        >
                                            Inscription
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
                                        <TableHead
                                            className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_ACTION)}
                                        >
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customers.map((c) => (
                                        <TableRow key={c.id} className={ADMIN_TABLE_ROW}>
                                            <TableCell className={ADMIN_TABLE_CELL}>
                                                <Link
                                                    href={route('admin.sales.customers.show', c.id)}
                                                    className="flex min-w-0 items-center gap-3 font-medium text-neutral-900 hover:text-[#0059DD]"
                                                >
                                                    <CustomerAvatar
                                                        name={c.name}
                                                        avatarUrl={c.avatar_url}
                                                    />
                                                    <span className="min-w-0">
                                                        <span className="block truncate">
                                                            {c.name}
                                                        </span>
                                                        <span className={ADMIN_MOBILE_META}>
                                                            {c.phone || c.email}
                                                        </span>
                                                        <span className={ADMIN_MOBILE_META}>
                                                            {c.orders_count} cmd. · $
                                                            {Number(c.total_spent).toFixed(2)}
                                                        </span>
                                                    </span>
                                                </Link>
                                            </TableCell>
                                            <TableCell
                                                className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_MD)}
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate">{c.email}</p>
                                                    <p className={cn(ADMIN_MUTED, 'truncate text-xs')}>
                                                        {c.phone || 'Tél. non renseigné'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_MD)}
                                            >
                                                {c.member_since
                                                    ? new Date(c.member_since).toLocaleDateString(
                                                          'fr-FR',
                                                      )
                                                    : '—'}
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
                                                {`$${Number(c.total_spent).toFixed(2)}`}
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
                                            <TableCell
                                                className={cn(
                                                    ADMIN_TABLE_CELL,
                                                    ADMIN_TABLE_COL_ACTION,
                                                )}
                                            >
                                                <Link
                                                    href={route('admin.sales.customers.show', c.id)}
                                                    className={cn(
                                                        ADMIN_BTN_SM_OUTLINE,
                                                        'inline-flex justify-center',
                                                    )}
                                                >
                                                    Voir
                                                </Link>
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
