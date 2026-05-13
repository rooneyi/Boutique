import { Head, Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { SF_CARD } from '@/lib/storefront-ui-styles';
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
    vendor: { shop_name: string };
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
};

type PaginatedProducts = {
    data: Product[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: { current_page: number; last_page: number; total: number };
};

type Props = {
    products: PaginatedProducts;
};

export default function CustomerFavorites({ products }: Props) {
    const items = products.data ?? [];

    return (
        <>
            <Head title="Mes favoris" />

            <div className="space-y-8">
                <div>
                    <h1 className="font-poppins text-3xl font-semibold tracking-tight text-black">Mes favoris</h1>
                    <p className="mt-1 font-poppins text-sm text-[#747474]">Produits enregistrés pour plus tard.</p>
                </div>

                {items.length === 0 ? (
                    <Card className={cn(SF_CARD, 'p-8 text-center')}>
                        <p className="text-[#747474]">Vous n’avez pas encore de favoris.</p>
                        <Button className="mt-6 rounded-sm bg-[#0059DD] font-poppins hover:bg-[#0047b0]" asChild>
                            <Link href={route('customer.products.index')}>Parcourir le catalogue</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {items.map((product) => (
                            <Card key={product.id} className={cn(SF_CARD, 'overflow-hidden')}>
                                <div className="relative">
                                    {product.image_path ? (
                                        <Link href={route('customer.products.show', product.id)} className="block">
                                            <img src={product.image_path} alt="" className="h-48 w-full object-cover" />
                                        </Link>
                                    ) : (
                                        <div className="flex h-48 w-full items-center justify-center bg-neutral-100">
                                            <ShoppingCart className="h-8 w-8 text-neutral-400" />
                                        </div>
                                    )}
                                    <div className="absolute right-2 top-2 rounded-sm bg-white/90 shadow-sm">
                                        <FavoriteButton productId={product.id} favorited={product.is_favorite} />
                                    </div>
                                </div>

                                <CardContent className="space-y-3 p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-[#747474]">{product.vendor.shop_name}</p>
                                    <Link href={route('customer.products.show', product.id)}>
                                        <h3 className="line-clamp-2 font-semibold text-black hover:text-[#0059DD]">{product.name}</h3>
                                    </Link>
                                    <StarRatingDisplay value={product.rating_avg} count={product.reviews_count} />
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-lg font-semibold">€{product.price.toFixed(2)}</span>
                                        {product.quantity > 0 ? (
                                            <Badge variant="outline" className="rounded-sm">
                                                En stock
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="rounded-sm">
                                                Rupture
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" className="w-full rounded-sm font-poppins" asChild>
                                            <Link href={route('customer.products.show', product.id)}>Voir détail</Link>
                                        </Button>
                                        <AddToCartButton
                                            productId={product.id}
                                            disabled={product.quantity === 0}
                                            className="w-full justify-center text-base"
                                            label="Ajouter au panier"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {products.meta && products.meta.last_page > 1 && (
                    <nav className="flex flex-wrap items-center justify-center gap-2">
                        {products.links?.map((link, i) => {
                            if (link.label.includes('...')) {
                                return (
                                    <span key={i} className="px-2 text-[#747474]">
                                        …
                                    </span>
                                );
                            }
                            const label = link.label.replace(/<[^>]+>/g, '').trim();
                            if (!link.url) {
                                return (
                                    <Button key={i} variant="outline" size="sm" className="rounded-sm" disabled>
                                        {label}
                                    </Button>
                                );
                            }
                            return (
                                <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" className="rounded-sm" asChild>
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
