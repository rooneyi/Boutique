import { MessageCircle, Minus, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { cn } from '@/lib/utils';

export type ProductVariantPayload = {
    id: number;
    color: string;
    color_hex: string | null;
    size: string;
    sku: string | null;
    stock: number;
    image_path: string | null;
};

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image_path?: string | null;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
    variants: ProductVariantPayload[];
};

const FALLBACK_COLORS: Record<string, string> = {
    noir: '#000000',
    black: '#000000',
    blanc: '#ffffff',
    white: '#ffffff',
    bleu: '#0059DD',
    jaune: '#E8C547',
    lilas: '#C4B5E8',
    gris: '#BFBFBF',
};

function swatchClass(hex: string | null, colorName: string): string {
    if (hex) {
        return '';
    }
    const key = colorName.toLowerCase();
    return FALLBACK_COLORS[key] ? '' : 'bg-neutral-300';
}

function swatchStyle(hex: string | null, colorName: string): React.CSSProperties {
    if (hex) {
        return { backgroundColor: hex };
    }
    const key = colorName.toLowerCase();
    return { backgroundColor: FALLBACK_COLORS[key] ?? '#d4d4d4' };
}

type Props = {
    product: Product;
    onVariantImageChange?: (imageUrl: string | null) => void;
};

export function ProductPurchasePanel({ product, onVariantImageChange }: Props) {
    const colors = useMemo(() => {
        const seen = new Map<string, { name: string; hex: string | null }>();
        for (const v of product.variants) {
            if (!seen.has(v.color)) {
                seen.set(v.color, { name: v.color, hex: v.color_hex });
            }
        }
        return Array.from(seen.values());
    }, [product.variants]);

    const [colorName, setColorName] = useState(colors[0]?.name ?? '');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    const sizesForColor = useMemo(() => {
        const set = new Set<string>();
        product.variants
            .filter((v) => v.color === colorName)
            .forEach((v) => set.add(v.size));
        return Array.from(set).sort();
    }, [product.variants, colorName]);

    const activeVariant = useMemo(
        () => product.variants.find((v) => v.color === colorName && v.size === size) ?? null,
        [product.variants, colorName, size],
    );

    useEffect(() => {
        if (colors.length > 0 && !colors.some((c) => c.name === colorName)) {
            setColorName(colors[0].name);
        }
    }, [colors, colorName]);

    useEffect(() => {
        if (sizesForColor.length > 0 && !sizesForColor.includes(size)) {
            setSize(sizesForColor[0]);
        }
    }, [sizesForColor, size]);

    useEffect(() => {
        setQuantity(1);
    }, [activeVariant?.id]);

    useEffect(() => {
        const url = activeVariant?.image_path ?? product.image_path ?? null;
        onVariantImageChange?.(url);
    }, [activeVariant?.image_path, product.image_path, onVariantImageChange]);

    const maxQty = activeVariant?.stock ?? 0;
    const lineTotal = product.price * quantity;

    if (product.variants.length === 0) {
        return (
            <div className="font-poppins text-[#747474]">
                Aucun article disponible pour ce produit.
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-6 sm:gap-9 lg:mx-auto">
            <div className="space-y-2.5">
                <h1 className="font-poppins text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold text-black">
                    {product.name}
                </h1>
                {product.category ? (
                    <p className="font-poppins text-sm font-medium text-[#747474]">{product.category}</p>
                ) : null}
                <StarRatingDisplay
                    value={product.rating_avg}
                    count={product.reviews_count}
                    size="md"
                />
                <p className="font-poppins text-2xl font-medium text-[#0059DD] sm:text-[28px]">
                    {product.price.toFixed(2)} $
                </p>
            </div>

            <div className="space-y-2.5">
                <p className="font-poppins text-lg font-semibold text-black sm:text-xl lg:text-[28px]">
                    Couleur :
                </p>
                <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            title={c.name}
                            onClick={() => setColorName(c.name)}
                            className={cn(
                                'size-12 rounded-full border-2 transition-all',
                                swatchClass(c.hex, c.name),
                                colorName === c.name
                                    ? 'border-black ring-2 ring-black ring-offset-2'
                                    : 'border-neutral-300',
                            )}
                            style={swatchStyle(c.hex, c.name)}
                            aria-label={c.name}
                            aria-pressed={colorName === c.name}
                        />
                    ))}
                </div>
                <p className="font-poppins text-sm text-[#747474]">{colorName}</p>
            </div>

            <div className="space-y-2.5">
                <p className="font-poppins text-lg font-semibold text-black sm:text-xl lg:text-[28px]">
                    Taille :
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                    {sizesForColor.map((s) => {
                        const variant = product.variants.find(
                            (v) => v.color === colorName && v.size === s,
                        );
                        const out = (variant?.stock ?? 0) <= 0;
                        return (
                            <button
                                key={s}
                                type="button"
                                disabled={out}
                                onClick={() => setSize(s)}
                                className={cn(
                                    'rounded-full px-6 py-2 font-poppins text-lg font-medium transition-colors sm:px-10 sm:text-2xl',
                                    size === s
                                        ? 'bg-black text-white'
                                        : 'text-black hover:bg-neutral-100',
                                    out && 'cursor-not-allowed opacity-40 line-through',
                                )}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeVariant?.sku ? (
                <p className="font-poppins text-sm text-[#747474]">
                    Réf. article : <span className="font-semibold text-black">{activeVariant.sku}</span>
                </p>
            ) : null}

            <p className="font-poppins text-sm text-[#747474]">
                Stock :{' '}
                <span className={cn('font-semibold', maxQty > 0 ? 'text-black' : 'text-[#c40000]')}>
                    {maxQty > 0 ? maxQty : 'Rupture'}
                </span>
            </p>

            <div className="flex flex-col gap-6 sm:gap-9">
                <div className="space-y-2.5">
                    <p className="font-poppins text-lg font-semibold text-black sm:text-xl lg:text-[28px]">
                        Quantité :
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="flex items-center justify-center gap-8 rounded-[20px] border border-[#5B5E64]/60 px-3 py-2 sm:justify-start sm:gap-12">
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={maxQty <= 0}
                                className="flex size-9 items-center justify-center text-black disabled:opacity-40"
                                aria-label="Diminuer"
                            >
                                <Minus className="size-6" />
                            </button>
                            <span className="font-poppins text-2xl text-black">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                                disabled={quantity >= maxQty}
                                className="flex size-9 items-center justify-center text-black disabled:opacity-40"
                                aria-label="Augmenter"
                            >
                                <Plus className="size-6" />
                            </button>
                        </div>
                        <p className="font-poppins text-xl font-medium text-black sm:text-2xl lg:text-[28px]">
                            {lineTotal.toFixed(2)} $
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <AddToCartButton
                        productId={product.id}
                        variantId={activeVariant?.id}
                        quantity={quantity}
                        disabled={!activeVariant || maxQty <= 0}
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
        </div>
    );
}
