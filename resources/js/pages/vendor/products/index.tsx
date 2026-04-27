import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { router } from '@inertiajs/react';

type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string;
    status: string;
    created_at: string;
};

type Props = {
    products: {
        data: Product[];
        meta: any;
    };
};

export default function ProductsList() {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        router.delete(route('vendor.products.destroy', id));
        setDeleteId(null);
    };

    return (
        <>
            <Head title="Mes Produits" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mes Produits</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gérez votre catalogue de produits
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={route('vendor.products.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un Produit
                        </Link>
                    </Button>
                </div>

                {/* Tableau */}
                <Card>
                    <CardHeader>
                        <CardTitle>Produits en Vente</CardTitle>
                        <CardDescription>Liste complète de vos produits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produit</TableHead>
                                        <TableHead className="text-right">Prix</TableHead>
                                        <TableHead className="text-right">Stock</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usePage<Props>().props.products.data.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                €{product.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {product.quantity > 10 ? (
                                                    <Badge variant="outline">
                                                        {product.quantity} en stock
                                                    </Badge>
                                                ) : product.quantity > 0 ? (
                                                    <Badge variant="secondary">
                                                        {product.quantity} faible
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Rupture
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{product.category || '-'}</TableCell>
                                            <TableCell>
                                                <Badge>{product.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={route(
                                                                'vendor.products.edit',
                                                                product.id
                                                            )}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => setDeleteId(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le produit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Le produit sera supprimé définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => deleteId && handleDelete(deleteId)}
                    >
                        Supprimer
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
