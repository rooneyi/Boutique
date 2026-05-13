import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, ShoppingCart } from 'lucide-react';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { SF_CARD } from '@/lib/storefront-ui-styles';
import { useState } from 'react';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    image_path?: string;
    vendor: {
        shop_name: string;
    };
};

type PaginatedProducts = {
    data: Product[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: { current_page: number; last_page: number; total: number };
};

type Props = {
    products: PaginatedProducts;
};

export default function BrowseProducts({ products }: Props) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    const items = products.data ?? [];

    const filtered = items.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'all' || p.category === category;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(items.map((p) => p.category))].filter(Boolean);

    return (
        <>
            <Head title="Parcourir les Produits" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nos Produits</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Découvrez notre sélection de vêtements
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Chercher un produit..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les catégories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            {filtered.length} affiché{filtered.length > 1 ? 's' : ''}
                            {products.meta?.total != null ? ` / ${products.meta.total} au total` : ''}
                        </Badge>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((product) => (
                            <Card key={product.id} className={cn(SF_CARD, 'overflow-hidden')}>
                                {product.image_path ? (
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 w-full items-center justify-center bg-muted">
                                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}

                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {product.vendor?.shop_name}
                                        </p>

                                        <h3 className="line-clamp-2 font-semibold leading-tight">{product.name}</h3>

                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-lg font-bold">€{product.price.toFixed(2)}</span>
                                            {product.quantity > 0 ? (
                                                <Badge variant="outline">En stock</Badge>
                                            ) : (
                                                <Badge variant="destructive">Rupture</Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Button variant="outline" className="w-full rounded-sm font-poppins" asChild>
                                                <Link href={route('customer.products.show', product.id)}>
                                                    Voir détail
                                                </Link>
                                            </Button>
                                            <AddToCartButton
                                                productId={product.id}
                                                disabled={product.quantity === 0}
                                                className="w-full justify-center text-base"
                                                label="Ajouter au panier"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Aucun produit ne correspond à votre recherche.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {products.meta && products.meta.last_page > 1 && (
                    <nav className="flex flex-wrap items-center justify-center gap-2">
                        {products.links?.map((link, i) => {
                            if (link.label.includes('...')) {
                                return (
                                    <span key={i} className="px-2 text-muted-foreground">
                                        …
                                    </span>
                                );
                            }
                            const label = link.label.replace(/<[^>]+>/g, '').trim();
                            if (!link.url) {
                                return (
                                    <Button key={i} variant="outline" size="sm" disabled>
                                        {label}
                                    </Button>
                                );
                            }
                            return (
                                <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" asChild>
                                    <Link href={link.url} preserveScroll>
                                        {label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                )}
            </div>
        </>
    );
}
