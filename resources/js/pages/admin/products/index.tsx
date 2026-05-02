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
    status?: string;
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
    filter?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
};

export default function AdminProducts() {
    const { products, filter } = usePage<Props>().props;

    const getFilterLabel = () => {
        switch (filter) {
            case 'in-stock':
                return 'En stock';
            case 'low-stock':
                return 'Stocks faibles';
            case 'out-of-stock':
                return 'Ruptures';
            case 'discontinued':
                return 'Produits terminés';
            default:
                return 'Tous les produits';
        }
    };

    const stockBadge = (product: Product) => {
        if (product.status === 'DISCONTINUED') {
            return <Badge variant="outline">Terminé</Badge>;
        }
        if (product.quantity === 0) {
            return <Badge variant="destructive">Rupture</Badge>;
        }
        if (product.quantity < 10) {
            return <Badge variant="secondary">Faible</Badge>;
        }
        return <Badge variant="outline">En stock</Badge>;
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
                    <div className="flex flex-wrap gap-2">
                        <Button variant={filter === 'all' || !filter ? 'default' : 'outline'} asChild>
                            <Link href={route('admin.products.index')}>Tous</Link>
                        </Button>
                        <Button variant={filter === 'in-stock' ? 'default' : 'outline'} asChild>
                            <Link href={route('admin.products.in-stock')}>En stock</Link>
                        </Button>
                        <Button variant={filter === 'low-stock' ? 'default' : 'outline'} asChild>
                            <Link href={route('admin.products.low-stock')}>Faible stock</Link>
                        </Button>
                        <Button variant={filter === 'out-of-stock' ? 'default' : 'outline'} asChild>
                            <Link href={route('admin.products.out-of-stock')}>Ruptures</Link>
                        </Button>
                        <Button variant={filter === 'discontinued' ? 'default' : 'outline'} asChild>
                            <Link href={route('admin.products.discontinued')}>Terminés</Link>
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
                                                <TableCell>{stockBadge(product)}</TableCell>
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
