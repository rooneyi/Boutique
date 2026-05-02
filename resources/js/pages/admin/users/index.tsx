import { Head } from '@inertiajs/react';
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

function segmentVariant(segment: CustomerRow['segment']): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (segment) {
        case 'frequent':
            return 'default';
        case 'inactive':
        case 'never_ordered':
            return 'secondary';
        default:
            return 'outline';
    }
}

export default function AdminUsers({ users, role }: Props) {
    const title = role === 'vendor' ? 'Vendeurs' : 'Clients';
    const description =
        role === 'vendor' ? 'Gestion des vendeurs de la plateforme' : 'Liste globale — fidèles et inactifs';

    const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR');

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>Données agrégées pour le pilotage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Email</TableHead>
                                            {role === 'vendor' && <TableHead>Boutique</TableHead>}
                                            {role === 'customer' && (
                                                <>
                                                    <TableHead className="text-right">Commandes</TableHead>
                                                    <TableHead className="text-right">Total dépensé</TableHead>
                                                    <TableHead>Dernière commande</TableHead>
                                                    <TableHead>Profil</TableHead>
                                                </>
                                            )}
                                            <TableHead>Inscription</TableHead>
                                            {role === 'vendor' && <TableHead>Statut</TableHead>}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {role === 'vendor'
                                            ? (users.data as VendorRow[]).map((user) => (
                                                  <TableRow key={user.id}>
                                                      <TableCell className="font-medium">{user.name}</TableCell>
                                                      <TableCell>{user.email}</TableCell>
                                                      <TableCell>{user.shop_name || '—'}</TableCell>
                                                      <TableCell>{formatDate(user.created_at)}</TableCell>
                                                      <TableCell>
                                                          <Badge variant="outline">Actif</Badge>
                                                      </TableCell>
                                                  </TableRow>
                                              ))
                                            : (users.data as CustomerRow[]).map((user) => (
                                                  <TableRow key={user.id}>
                                                      <TableCell className="font-medium">{user.name}</TableCell>
                                                      <TableCell>{user.email}</TableCell>
                                                      <TableCell className="text-right">{user.orders_count}</TableCell>
                                                      <TableCell className="text-right">
                                                          €{Number(user.total_spent).toFixed(2)}
                                                      </TableCell>
                                                      <TableCell className="text-sm text-muted-foreground">
                                                          {user.last_order_at
                                                              ? formatDate(user.last_order_at)
                                                              : '—'}
                                                      </TableCell>
                                                      <TableCell>
                                                          <Badge variant={segmentVariant(user.segment)}>
                                                              {segmentLabel(user.segment)}
                                                          </Badge>
                                                      </TableCell>
                                                      <TableCell>{formatDate(user.created_at)}</TableCell>
                                                  </TableRow>
                                              ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                <p>Aucun {title.toLowerCase()} enregistré</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
