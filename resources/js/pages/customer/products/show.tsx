import { Head, Link, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import { ProductReviewForm } from '@/components/storefront/product-review-form';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { ShoppingCart, Truck, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { route } from '@/lib/route';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    stock: number;
    category: string;
    image_path?: string;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
    colors?: string[];
    sizes?: string[];
    vendor: {
        id: number;
        shop_name: string;
    };
};

type ReviewRow = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    author: string;
};

type UserReview = {
    rating: number;
    comment: string | null;
    updated_at: string;
} | null;

type Props = {
    product: Product;
    category_name?: string;
    reviews: ReviewRow[];
    user_review: UserReview;
    can_review: boolean;
};

export default function ProductDetail() {
    const { product, category_name, reviews, user_review, can_review } = usePage<Props>().props;
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    const colors = product.colors || ['black', 'green', 'orange', 'blue'];
    const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];

    const discount = product.original_price
        ? Math.round(((Number(product.original_price) - product.price) / Number(product.original_price)) * 100)
        : 0;

    const colorMap: Record<string, string> = {
        black: 'bg-black',
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        white: 'bg-white border border-gray-300',
    };

    return (
        <>
            <Head title={product.name} />

            <div className="min-h-screen bg-white">
                <div className="border-b px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Link href={route('customer.products.index')} className="hover:text-gray-900">
                            Produits
                        </Link>
                        <span>›</span>
                        <Link href={route('customer.products.index')} className="hover:text-gray-900">
                            {category_name || 'Catégorie'}
                        </Link>
                        <span>›</span>
                        <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                </div>

                <div className="px-6 py-8">
                    <div className="grid gap-12 md:grid-cols-2">
                        <div className="space-y-4">
                            <div className="relative aspect-square overflow-hidden rounded-sm bg-gray-100">
                                {product.image_path ? (
                                    <img src={product.image_path} alt={product.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <ShoppingCart className="h-24 w-24 text-gray-300" />
                                    </div>
                                )}
                                <div className="absolute right-2 top-2 rounded-sm bg-white/90 shadow-sm">
                                    <FavoriteButton productId={product.id} favorited={product.is_favorite} />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`aspect-square overflow-hidden rounded-sm border-2 ${
                                            i === selectedColor ? 'border-black' : 'border-gray-200'
                                        }`}
                                    >
                                        {product.image_path ? (
                                            <img
                                                src={product.image_path}
                                                alt={`${product.name} vue ${i + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gray-100">
                                                <span className="text-xs text-gray-400">{i + 1}</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <StarRatingDisplay value={product.rating_avg} count={product.reviews_count} size="md" />

                                <h1 className="text-4xl font-bold">{product.name}</h1>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-4xl font-bold">€{product.price.toFixed(2)}</span>
                                    {product.original_price && (
                                        <>
                                            <span className="text-lg text-gray-400 line-through">
                                                €{Number(product.original_price).toFixed(2)}
                                            </span>
                                            <span className="text-lg font-semibold text-green-600">{discount}%</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="text-sm">
                                <span className="text-gray-600">Vendeur : </span>
                                <span className="font-medium">{product.vendor.shop_name}</span>
                            </div>

                            <div className="space-y-3">
                                <span className="block text-sm font-semibold">Couleur :</span>
                                <div className="flex gap-3">
                                    {colors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedColor(idx)}
                                            className={`h-8 w-8 rounded-full border-2 transition-all ${
                                                selectedColor === idx ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-300'
                                            } ${colorMap[color] || 'bg-gray-400'}`}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <span className="block text-sm font-semibold">Taille :</span>
                                <div className="flex flex-wrap gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setSelectedSize(size)}
                                            className={`rounded-sm border-2 px-4 py-2 font-medium transition-all ${
                                                selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <span className="block text-sm font-semibold">Quantité :</span>
                                <div className="flex w-fit items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="rounded-sm border border-gray-300 px-3 py-2 hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                                        className="w-16 rounded-sm border border-gray-300 py-2 text-center"
                                        min={1}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="rounded-sm border border-gray-300 px-3 py-2 hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <AddToCartButton
                                    productId={product.id}
                                    quantity={quantity}
                                    disabled={product.stock <= 0}
                                    className="flex-1 text-base"
                                    size="lg"
                                />
                            </div>

                            <div className="border-t pt-6" />

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <Truck className="mt-1 h-6 w-6 shrink-0 text-gray-400" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Livraison</h3>
                                        <p className="text-sm text-gray-600">Délais selon votre zone (à confirmer au paiement).</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <RotateCcw className="mt-1 h-6 w-6 shrink-0 text-gray-400" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Retours</h3>
                                        <p className="text-sm text-gray-600">Conditions selon la boutique vendeuse.</p>
                                    </div>
                                </div>
                            </div>

                            {product.stock > 0 ? (
                                <Badge variant="outline" className="w-fit rounded-sm border-green-200 bg-green-50 text-green-700">
                                    En stock ({product.stock})
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="w-fit rounded-sm border-red-200 bg-red-50 text-red-700">
                                    Rupture de stock
                                </Badge>
                            )}
                        </div>
                    </div>

                    <section className="mt-12 border-t border-neutral-200 pt-10">
                        <h2 className="font-poppins text-2xl font-semibold text-black">Avis clients</h2>
                        <p className="mt-1 font-poppins text-sm text-[#747474]">
                            Note moyenne sur la base des avis vérifiés (clients ayant commandé le produit).
                        </p>

                        <div className="mt-6 grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <ProductReviewForm productId={product.id} canReview={can_review} userReview={user_review} />
                            </div>
                            <div className="space-y-4 lg:col-span-2">
                                {reviews.length === 0 ? (
                                    <p className="font-poppins text-sm text-[#747474]">Aucun avis publié pour le moment.</p>
                                ) : (
                                    <ul className="space-y-4">
                                        {reviews.map((r) => (
                                            <li key={r.id} className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <span className="font-poppins font-semibold text-black">{r.author}</span>
                                                    <span className="text-xs text-[#747474]">
                                                        {new Date(r.created_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <StarRatingDisplay value={r.rating} size="sm" />
                                                </div>
                                                {r.comment ? (
                                                    <p className="mt-2 font-poppins text-sm text-[#747474]">{r.comment}</p>
                                                ) : null}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
