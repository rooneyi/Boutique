import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useState } from 'react';

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

type Props = {
    products: Product[];
};

export default function BrowseProducts({ products }: Props) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const filtered = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !category || p.category === category;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

    return (
        <>
            <Head title="Parcourir les Produits" />

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nos Produits</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Découvrez notre sélection de vêtements
                    </p>
                </div>

                {/* Recherche et Filtres */}
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
                            <SelectItem value="">Toutes les catégories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div>
                        <Badge variant="secondary">
                            {filtered.length} produit
                            {filtered.length > 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                {/* Grille de Produits */}
                {filtered.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((product) => (
                            <Card key={product.id} className="overflow-hidden">
                                {/* Image */}
                                {product.image_path ? (
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-48 w-full bg-muted flex items-center justify-center">
                                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}

                                {/* Contenu */}
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {/* Boutique */}
                                        <p className="text-xs font-medium text-muted-foreground">
                                            {product.vendor?.shop_name}
                                        </p>

                                        {/* Nom */}
                                        <h3 className="font-semibold leading-tight line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Prix et Statut */}
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-lg font-bold">
                                                €{product.price.toFixed(2)}
                                            </span>
                                            {product.quantity > 0 ? (
                                                <Badge variant="outline">En stock</Badge>
                                            ) : (
                                                <Badge variant="destructive">Rupture</Badge>
                                            )}
                                        </div>

                                        {/* Button */}
                                        <Button
                                            className="w-full"
                                            disabled={product.quantity === 0}
                                            asChild
                                        >
                                            <Link href={route('customer.products.show', product.id)}>
                                                Voir détail
                                            </Link>
                                        </Button>
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
            </div>
        </>
    );
}
