import { MessageCircle, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { cn } from '@/lib/utils';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
};

const COLORS = [
    { id: 'noir', label: 'Noir', className: 'bg-black' },
    { id: 'jaune', label: 'Jaune', className: 'bg-[#E8C547]' },
    { id: 'lilas', label: 'Lilas', className: 'bg-[#C4B5E8]' },
] as const;

const SIZES = ['S', 'M', 'L', 'XL'] as const;

export function ProductPurchasePanel({ product }: { product: Product }) {
    const [colorId, setColorId] = useState<(typeof COLORS)[number]['id']>('noir');
    const [size, setSize] = useState<string>('S');
    const [quantity, setQuantity] = useState(2);

    const lineTotal = product.price * quantity;

    return (
        <div className="flex w-full max-w-[542px] flex-col gap-9">
            <div className="space-y-2.5">
                <h1 className="font-poppins text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-black">
                    {product.name}
                </h1>
                <StarRatingDisplay
                    value={product.rating_avg}
                    count={product.reviews_count}
                    size="md"
                />
                <p className="font-poppins text-[28px] font-medium text-[#0059DD]">
                    {product.price.toFixed(2)} $
                </p>
            </div>

            <div className="space-y-2.5">
                <p className="font-poppins text-[28px] font-semibold text-black">
                    Couleur :
                </p>
                <div className="flex gap-3">
                    {COLORS.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            title={c.label}
                            onClick={() => setColorId(c.id)}
                            className={cn(
                                'size-12 rounded-full border-2 transition-all',
                                c.className,
                                colorId === c.id
                                    ? 'border-black ring-2 ring-black ring-offset-2'
                                    : 'border-neutral-300',
                            )}
                            aria-label={c.label}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-2.5">
                <p className="font-poppins text-[28px] font-semibold text-black">
                    Taille :
                </p>
                <div className="flex flex-wrap gap-4">
                    {SIZES.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setSize(s)}
                            className={cn(
                                'rounded-full px-10 py-2.5 font-poppins text-2xl font-medium transition-colors',
                                size === s
                                    ? 'bg-black text-white'
                                    : 'text-black hover:bg-neutral-100',
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2.5">
                <p className="font-poppins text-[28px] font-semibold text-black">
                    Quantité :
                </p>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-12 rounded-[20px] border border-[#5B5E64]/60 px-3 py-2">
                        <button
                            type="button"
                            onClick={() =>
                                setQuantity((q) => Math.max(1, q - 1))
                            }
                            className="flex size-9 items-center justify-center text-black"
                            aria-label="Diminuer"
                        >
                            <Minus className="size-6" />
                        </button>
                        <span className="font-poppins text-2xl text-black">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuantity((q) => q + 1)}
                            className="flex size-9 items-center justify-center text-black"
                            aria-label="Augmenter"
                        >
                            <Plus className="size-6" />
                        </button>
                    </div>
                    <p className="font-poppins text-[28px] font-medium text-black">
                        {lineTotal.toFixed(2)} $
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
                <AddToCartButton
                    productId={product.id}
                    quantity={quantity}
                    disabled={product.stock <= 0}
                    label="AJOUTER AU PANIER"
                    className="h-14 min-h-14 flex-1 rounded-full bg-black font-poppins text-base font-semibold uppercase text-white hover:bg-neutral-800"
                />
                <FavoriteButton
                    productId={product.id}
                    favorited={product.is_favorite}
                    className="size-[50px] shrink-0 rounded-full border border-black bg-white"
                />
            </div>

            <a
                href="https://wa.me/243991934590"
                target="_blank"
                rel="noreferrer"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-black bg-white font-poppins text-base font-semibold text-black transition-colors hover:bg-neutral-50"
            >
                <MessageCircle className="size-6" aria-hidden />
                Commander via WhatsApp
            </a>
        </div>
    );
}
