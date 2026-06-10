import { Head } from '@inertiajs/react';
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
import { AdminBadge, customerSegmentBadgeVariant } from '@/components/admin/admin-badge';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import {
    ADMIN_H3,
    ADMIN_MOBILE_META,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
    ADMIN_TABLE_COL_MD,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type CustomerRow = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    orders_count: number;
    total_spent: number;
    last_order_at: string | null;
    segment: 'frequent' | 'active' | 'inactive' | 'never_ordered';
};

type Props = {
    users: {
        data: CustomerRow[];
    };
    role: 'customer';
};

function segmentLabel(segment: CustomerRow['segment']): string {
    switch (segment) {
        case 'frequent':
            return 'Fidèle';
        case 'never_ordered':
            return 'Sans commande';
        case 'inactive':
            return 'Inactif';
        default:
            return 'Actif';
    }
}

export default function AdminUsers({ users }: Props) {
    const title = 'Clients';
    const description = 'Liste globale des clients — fidèles, actifs et inactifs.';

    const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

    return (
        <>
            <Head title={title} />

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHeader title={title} description={description} />

                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>{title}</h3>
                        <AdminCardDescription>
                            {users.data.length} compte(s) affiché(s)
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        {users.data.length > 0 ? (
                            <AdminDataTable>
                                    <TableHeader>
                                        <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Nom</TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD)}>
                                                Email
                                            </TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, 'text-right')}>
                                                Commandes
                                            </TableHead>
                                            <TableHead
                                                className={cn(
                                                    ADMIN_TABLE_HEAD,
                                                    ADMIN_TABLE_COL_MD,
                                                    'text-right',
                                                )}
                                            >
                                                Total
                                            </TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD)}>
                                                Dernière cmd.
                                            </TableHead>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Profil</TableHead>
                                            <TableHead className={cn(ADMIN_TABLE_HEAD, ADMIN_TABLE_COL_MD)}>
                                                Inscription
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.map((user) => (
                                                  <TableRow key={user.id} className={ADMIN_TABLE_ROW}>
                                                      <TableCell
                                                          className={cn(ADMIN_TABLE_CELL, 'font-medium text-neutral-900')}
                                                      >
                                                          {user.name}
                                                          <span className={ADMIN_MOBILE_META}>{user.email}</span>
                                                          <span className={ADMIN_MOBILE_META}>
                                                              {user.orders_count} cmd. · €
                                                              {Number(user.total_spent).toFixed(2)}
                                                              {user.last_order_at
                                                                  ? ` · ${formatDate(user.last_order_at)}`
                                                                  : ''}
                                                          </span>
                                                      </TableCell>
                                                      <TableCell className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_MD)}>
                                                          {user.email}
                                                      </TableCell>
                                                      <TableCell
                                                          className={cn(ADMIN_TABLE_CELL, 'text-right')}
                                                      >
                                                          {user.orders_count}
                                                      </TableCell>
                                                      <TableCell
                                                          className={cn(
                                                              ADMIN_TABLE_CELL,
                                                              ADMIN_TABLE_COL_MD,
                                                              'text-right',
                                                          )}
                                                      >
                                                          €{Number(user.total_spent).toFixed(2)}
                                                      </TableCell>
                                                      <TableCell className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_MD)}>
                                                          {user.last_order_at
                                                              ? formatDate(user.last_order_at)
                                                              : '—'}
                                                      </TableCell>
                                                      <TableCell>
                                                          <AdminBadge
                                                              variant={customerSegmentBadgeVariant(
                                                                  user.segment,
                                                              )}
                                                          >
                                                              {segmentLabel(user.segment)}
                                                          </AdminBadge>
                                                      </TableCell>
                                                      <TableCell className={cn(ADMIN_TABLE_CELL, ADMIN_TABLE_COL_MD)}>
                                                          {formatDate(user.created_at)}
                                                      </TableCell>
                                                  </TableRow>
                                        ))}
                                    </TableBody>
                            </AdminDataTable>
                        ) : (
                            <p className={cn(ADMIN_MUTED, 'py-12 text-center')}>
                                Aucun {title.toLowerCase()} enregistré
                            </p>
                        )}
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
