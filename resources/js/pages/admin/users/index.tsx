import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type User = {
    id: number;
    name: string;
    email: string;
    shop_name?: string;
    created_at: string;
};

type Props = {
    users: {
        data: User[];
    };
    role: 'vendor' | 'customer';
};

export default function AdminUsers({ users, role }: Props) {
    const title = role === 'vendor' ? 'Vendeurs' : 'Clients';
    const description =
        role === 'vendor'
            ? 'Gestion des vendeurs de la plateforme'
            : 'Gestion des clients';

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    return (
        <>
            <Head title={title} />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                {/* Tableau */}
                <Card>
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            Liste complète des {title.toLowerCase()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {users.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Email</TableHead>
                                            {role === 'vendor' && (
                                                <TableHead>Boutique</TableHead>
                                            )}
                                            <TableHead>Date Inscription</TableHead>
                                            <TableHead>Statut</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                {role === 'vendor' && (
                                                    <TableCell>
                                                        {user.shop_name || '-'}
                                                    </TableCell>
                                                )}
                                                <TableCell>
                                                    {formatDate(user.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">Actif</Badge>
                                                </TableCell>
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
