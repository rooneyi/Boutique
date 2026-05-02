import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { route } from '@/lib/route';

type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    category: string | { id: number; name: string } | null;
    vendor: {
        shop_name: string;
    };
};

function categoryLabel(category: Product['category']): string {
    if (category == null) {
        return '—';
    }
    if (typeof category === 'string') {
        return category;
    }
    return category.name ?? '—';
}

type Props = {
    products: {
        data: Product[];
    };
    filter?: 'low-stock' | 'out-of-stock' | 'all';
};

export default function AdminProducts() {
    const { products, filter } = usePage<Props>().props;

    const getFilterLabel = () => {
        switch (filter) {
            case 'low-stock':
                return 'Stocks Faibles';
            case 'out-of-stock':
                return 'Ruptures';
            default:
                return 'Tous les Produits';
        }
    };

    return (
        <>
            <Head title={getFilterLabel()} />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {getFilterLabel()}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Supervision de l'inventaire
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            asChild
                        >
                            <Link href={route('admin.products.index')}>
                                Tous
                            </Link>
                        </Button>
                        <Button
                            variant={filter === 'low-stock' ? 'default' : 'outline'}
                            asChild
                        >
                            <Link href={route('admin.products.low-stock')}>
                                Faible stock
                            </Link>
                        </Button>
                        <Button
                            variant={filter === 'out-of-stock' ? 'default' : 'outline'}
                            asChild
                        >
                            <Link href={route('admin.products.out-of-stock')}>
                                Ruptures
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Tableaux */}
                <Card>
                    <CardHeader>
                        <CardTitle>{getFilterLabel()}</CardTitle>
                        <CardDescription>
                            Gestion complète de l'inventaire
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {products.data.length > 0 ? (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produit</TableHead>
                                            <TableHead>Vendeur</TableHead>
                                            <TableHead className="text-right">Prix</TableHead>
                                            <TableHead className="text-right">
                                                Stock
                                            </TableHead>
                                            <TableHead>Catégorie</TableHead>
                                            <TableHead>Statut</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    {product.name}
                                                </TableCell>
                                                <TableCell>
                                                    {product.vendor?.shop_name}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    €{Number(product.price).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {product.quantity}
                                                </TableCell>
                                                <TableCell>{categoryLabel(product.category)}</TableCell>
                                                <TableCell>
                                                    {product.quantity === 0 ? (
                                                        <Badge variant="destructive">
                                                            Rupture
                                                        </Badge>
                                                    ) : product.quantity < 10 ? (
                                                        <Badge variant="secondary">
                                                            Faible
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">
                                                            OK
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                <p>Aucun produit à afficher</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
