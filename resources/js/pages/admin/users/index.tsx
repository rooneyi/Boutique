import { Head } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminBadge, customerSegmentBadgeVariant } from '@/components/admin/admin-badge';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ADMIN_H3, ADMIN_MUTED, ADMIN_TABLE_CELL, ADMIN_TABLE_HEAD } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type VendorRow = {
    id: number;
    name: string;
    email: string;
    shop_name?: string;
    created_at: string;
};

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
        data: VendorRow[] | CustomerRow[];
    };
    role: 'vendor' | 'customer';
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

export default function AdminUsers({ users, role }: Props) {
    const title = role === 'vendor' ? 'Vendeurs' : 'Clients';
    const description =
        role === 'vendor'
            ? 'Gestion des vendeurs inscrits sur la plateforme PCJ.'
            : 'Liste globale des clients — fidèles, actifs et inactifs.';

    const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
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
                            <div className="overflow-x-auto rounded-sm border border-neutral-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className={ADMIN_TABLE_HEAD}>Nom</TableHead>
                                            <TableHead className={ADMIN_TABLE_HEAD}>Email</TableHead>
                                            {role === 'vendor' && (
                                                <TableHead className={ADMIN_TABLE_HEAD}>Boutique</TableHead>
                                            )}
                                            {role === 'customer' && (
                                                <>
                                                    <TableHead
                                                        className={cn(ADMIN_TABLE_HEAD, 'text-right')}
                                                    >
                                                        Commandes
                                                    </TableHead>
                                                    <TableHead
                                                        className={cn(ADMIN_TABLE_HEAD, 'text-right')}
                                                    >
                                                        Total dépensé
                                                    </TableHead>
                                                    <TableHead className={ADMIN_TABLE_HEAD}>
                                                        Dernière commande
                                                    </TableHead>
                                                    <TableHead className={ADMIN_TABLE_HEAD}>Profil</TableHead>
                                                </>
                                            )}
                                            <TableHead className={ADMIN_TABLE_HEAD}>Inscription</TableHead>
                                            {role === 'vendor' && (
                                                <TableHead className={ADMIN_TABLE_HEAD}>Statut</TableHead>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {role === 'vendor'
                                            ? (users.data as VendorRow[]).map((user) => (
                                                  <TableRow key={user.id}>
                                                      <TableCell
                                                          className={cn(ADMIN_TABLE_CELL, 'font-medium')}
                                                      >
                                                          {user.name}
                                                      </TableCell>
                                                      <TableCell className={ADMIN_TABLE_CELL}>
                                                          {user.email}
                                                      </TableCell>
                                                      <TableCell className={ADMIN_TABLE_CELL}>
                                                          {user.shop_name || '—'}
                                                      </TableCell>
                                                      <TableCell className={ADMIN_TABLE_CELL}>
                                                          {formatDate(user.created_at)}
                                                      </TableCell>
                                                      <TableCell>
                                                          <AdminBadge variant="blue">Actif</AdminBadge>
                                                      </TableCell>
                                                  </TableRow>
                                              ))
                                            : (users.data as CustomerRow[]).map((user) => (
                                                  <TableRow key={user.id}>
                                                      <TableCell
                                                          className={cn(ADMIN_TABLE_CELL, 'font-medium')}
                                                      >
                                                          {user.name}
                                                      </TableCell>
                                                      <TableCell className={ADMIN_TABLE_CELL}>
                                                          {user.email}
                                                      </TableCell>
                                                      <TableCell
                                                          className={cn(ADMIN_TABLE_CELL, 'text-right')}
                                                      >
                                                          {user.orders_count}
                                                      </TableCell>
                                                      <TableCell
                                                          className={cn(ADMIN_TABLE_CELL, 'text-right')}
                                                      >
                                                          €{Number(user.total_spent).toFixed(2)}
                                                      </TableCell>
                                                      <TableCell className={ADMIN_TABLE_CELL}>
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
                                                      <TableCell className={ADMIN_TABLE_CELL}>
                                                          {formatDate(user.created_at)}
                                                      </TableCell>
                                                  </TableRow>
                                              ))}
                                    </TableBody>
                                </Table>
                            </div>
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
