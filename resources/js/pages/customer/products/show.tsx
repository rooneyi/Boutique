import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
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
        id: number;
        shop_name: string;
    };
};

type Props = {
    product: Product;
};

export default function ProductDetail() {
    const { product } = usePage<Props>().props;
    const [quantity, setQuantity] = useState(1);
    const [addToCart, setAddToCart] = useState(false);

    const handleAddToCart = () => {
        // Logique d'ajout au panier
        setAddToCart(true);
    };

    return (
        <>
            <Head title={product.name} />

            <div className="space-y-6">
                {/* Retour */}
                <Button variant="ghost" size="sm" asChild>
                    <Link href={route('customer.products.index')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Link>
                </Button>

                {/* Contenu */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Image */}
                    <div>
                        {product.image_path ? (
                            <img
                                src={product.image_path}
                                alt={product.name}
                                className="w-full rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Détails */}
                    <div className="space-y-6">
                        {/* En-tête */}
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">
                                {product.vendor?.shop_name}
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-muted-foreground">{product.description}</p>
                        </div>

                        <Separator />

                        {/* Prix et Stock */}
                        <div className="space-y-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">
                                    €{product.price.toFixed(2)}
                                </span>
                            </div>

                            {product.quantity > 0 ? (
                                <Badge variant="outline" className="w-fit">
                                    En stock ({product.quantity})
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="w-fit">
                                    Rupture de stock
                                </Badge>
                            )}
                        </div>

                        <Separator />

                        {/* Sélecteur Quantité */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Quantité</label>
                            <div className="flex items-center gap-3">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    disabled={quantity === 1}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.quantity}
                                    value={quantity}
                                    onChange={(e) =>
                                        setQuantity(
                                            Math.min(
                                                product.quantity,
                                                Math.max(1, parseInt(e.target.value) || 1)
                                            )
                                        )
                                    }
                                    className="w-16 rounded border px-2 py-1 text-center"
                                />
                                <Button
                                    size="icon"
                                    variant="outline"
                                    disabled={quantity >= product.quantity}
                                    onClick={() =>
                                        setQuantity(Math.min(product.quantity, quantity + 1))
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Bouton Panier */}
                        <Button
                            size="lg"
                            className="w-full"
                            disabled={product.quantity === 0}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Ajouter au Panier
                        </Button>

                        {/* Autres infos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Infos Produit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Catégorie</span>
                                    <span>{product.category || '-'}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Confirmation */}
            <AlertDialog open={addToCart} onOpenChange={setAddToCart}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Produit Ajouté</AlertDialogTitle>
                        <AlertDialogDescription>
                            {quantity}x {product.name} a été ajouté au panier
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogCancel>Continuer shopping</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Link href={route('customer.cart')}>Voir le panier</Link>
                    </AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
