import { Link } from '@inertiajs/react';
import { Minus, Plus } from 'lucide-react';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    line: CartLine;
    busy: boolean;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
};

export function CartPageLine({ line, busy, onQuantityChange, onRemove }: Props) {
    const atMin = line.quantity <= 1;
    const atMax = line.quantity >= line.stock;

    return (
        <article className="flex flex-col gap-6 border-b border-[#e8e8e8] pb-10 last:border-b-0 sm:flex-row sm:gap-8">
            <div className="relative mx-auto w-full max-w-[218px] shrink-0 sm:mx-0">
                <Link
                    href={route('customer.products.show', line.product_id)}
                    className="block h-[240px] w-full overflow-hidden rounded-[20px] bg-neutral-100 sm:h-[284px] sm:w-[218px]"
                >
                    {line.image_path ? (
                        <img
                            src={line.image_path}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#737373]">
                            —
                        </div>
                    )}
                </Link>
                <FavoriteButton
                    productId={line.product_id}
                    favorited={line.is_favorite ?? false}
                    openDrawerOnAdd={false}
                    className="absolute top-3 right-3 size-10 rounded-full bg-white/90 shadow-sm hover:bg-white"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Link
                    href={route('customer.products.show', line.product_id)}
                    className="font-poppins text-xl font-bold leading-snug text-black hover:text-[#0059DD] sm:text-2xl"
                >
                    {line.name}
                </Link>
                <p className="font-poppins text-xl font-medium text-black">
                    {line.price.toFixed(2)} $
                </p>
                <p className="font-poppins text-lg font-medium text-[#737373]">Taille : M</p>
                <p className="font-poppins text-lg font-medium text-[#737373]">Couleur : Blanc</p>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                    <div className={cn('flex items-center gap-4', busy && 'pointer-events-none opacity-60')}>
                        <span className="font-poppins text-lg font-medium text-black">
                            Quantité : {line.quantity}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-10 rounded-full border-[#737373] text-black"
                                disabled={busy || atMin}
                                onClick={() => onQuantityChange(line.quantity - 1)}
                                aria-label="Diminuer la quantité"
                            >
                                <Minus className="size-5" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-10 rounded-full border-[#737373] text-black"
                                disabled={busy || atMax}
                                onClick={() => onQuantityChange(line.quantity + 1)}
                                aria-label="Augmenter la quantité"
                            >
                                <Plus className="size-5" />
                            </Button>
                        </div>
                    </div>
                    <p className="font-poppins text-2xl font-semibold text-black">
                        {line.line_total.toFixed(2)} $
                    </p>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    className="font-poppins h-auto w-fit p-0 text-sm font-semibold uppercase tracking-wide text-[#737373] hover:bg-transparent hover:text-black"
                    disabled={busy}
                    onClick={onRemove}
                >
                    Supprimer
                </Button>
            </div>
        </article>
    );
}
