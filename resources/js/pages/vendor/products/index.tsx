import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
import { route } from '@/lib/route';
import {
    VENDOR_BADGE,
    VENDOR_BTN_PRIMARY,
    VENDOR_CARD,
    VENDOR_H1,
    VENDOR_H3,
    VENDOR_H4,
    VENDOR_MUTED,
} from '@/lib/vendor-ui-styles';
import { cn } from '@/lib/utils';

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
        meta: unknown;
    };
};

export default function ProductsList() {
    const { products } = usePage<Props>().props;
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        router.delete(route('vendor.products.destroy', id));
        setDeleteId(null);
    };

    return (
        <>
            <Head title="Mes Produits" />

            <div className="space-y-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className={VENDOR_H1}>Collection</h1>
                        <p className={cn(VENDOR_MUTED, 'mt-3 max-w-xl')}>Gérez votre catalogue de produits.</p>
                    </div>
                    <Link href={route('vendor.products.create')} className={cn(VENDOR_BTN_PRIMARY, 'shrink-0')}>
                        <Plus className="h-5 w-5" />
                        Ajouter un produit
                    </Link>
                </div>

                <Card className={VENDOR_CARD}>
                    <CardHeader>
                        <h3 className={VENDOR_H3}>Produits en vente</h3>
                        <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>Liste complète de vos produits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-sm border border-neutral-200">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
                                        <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Produit</TableHead>
                                        <TableHead className={cn(VENDOR_H4, 'text-right text-[#747474]')}>Prix</TableHead>
                                        <TableHead className={cn(VENDOR_H4, 'text-right text-[#747474]')}>Stock</TableHead>
                                        <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Catégorie</TableHead>
                                        <TableHead className={cn(VENDOR_H4, 'text-[#747474]')}>Statut</TableHead>
                                        <TableHead className={cn(VENDOR_H4, 'text-right text-[#747474]')}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.map((product) => (
                                        <TableRow key={product.id} className="border-neutral-100">
                                            <TableCell className="font-poppins font-semibold text-black">{product.name}</TableCell>
                                            <TableCell className="text-right font-poppins text-black">
                                                €{Number(product.price).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {product.quantity > 10 ? (
                                                    <Badge
                                                        className={cn(
                                                            VENDOR_BADGE,
                                                            'border border-neutral-300 bg-white font-poppins text-xs font-normal text-black',
                                                        )}
                                                    >
                                                        {product.quantity} en stock
                                                    </Badge>
                                                ) : product.quantity > 0 ? (
                                                    <Badge
                                                        className={cn(
                                                            VENDOR_BADGE,
                                                            'bg-neutral-200 font-poppins text-xs font-semibold text-black',
                                                        )}
                                                    >
                                                        {product.quantity} faible
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        className={cn(
                                                            VENDOR_BADGE,
                                                            'bg-black font-poppins text-xs font-semibold text-white',
                                                        )}
                                                    >
                                                        Rupture
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className={VENDOR_MUTED}>{product.category || '—'}</TableCell>
                                            <TableCell>
                                                <span className="font-poppins text-sm font-normal text-[#747474]">{product.status}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route('vendor.products.edit', product.id)}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-neutral-300 text-black hover:border-[#0059DD] hover:text-[#0059DD]"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-neutral-300 text-black hover:bg-neutral-100"
                                                        onClick={() => setDeleteId(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
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

            <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="font-poppins">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-black">Supprimer le produit ?</AlertDialogTitle>
                        <AlertDialogDescription className={VENDOR_MUTED}>
                            Cette action est irréversible. Le produit sera supprimé définitivement.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel className="font-poppins">Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-black font-poppins text-white hover:bg-neutral-800"
                        onClick={() => deleteId && handleDelete(deleteId)}
                    >
                        Supprimer
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
