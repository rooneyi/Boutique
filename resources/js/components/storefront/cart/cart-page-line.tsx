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
        <article className="flex flex-col gap-5 border-b border-[#e8e8e8] pb-8 last:border-b-0 sm:flex-row sm:gap-8 sm:pb-10">
            <div className="relative mx-auto w-full max-w-[163px] shrink-0 sm:mx-0">
                <Link
                    href={route('customer.products.show', line.product_id)}
                    className="block aspect-[163/213] w-full overflow-hidden rounded-[20px] bg-neutral-100 sm:h-[284px] sm:w-[218px] sm:aspect-auto"
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
                    className="absolute top-3 right-3 size-9 rounded-full bg-white/90 shadow-sm hover:bg-white sm:size-10"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
                <Link
                    href={route('customer.products.show', line.product_id)}
                    className="font-poppins text-lg font-bold leading-snug text-black hover:text-[#0059DD] sm:text-2xl"
                >
                    {line.name.split(' — ')[0]}
                </Link>
                <p className="font-poppins text-lg font-medium text-black sm:text-xl">
                    {line.price.toFixed(2)} $
                </p>
                {line.size ? (
                    <p className="font-poppins text-base font-medium text-[#737373] sm:text-lg">
                        Taille : {line.size}
                    </p>
                ) : null}
                {line.color ? (
                    <p className="font-poppins text-base font-medium text-[#737373] sm:text-lg">
                        Couleur : {line.color}
                    </p>
                ) : null}

                <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
                    <div
                        className={cn(
                            'flex items-center gap-3 font-poppins text-base font-medium text-[#737373] sm:text-lg',
                            busy && 'pointer-events-none opacity-60',
                        )}
                    >
                        <span>Quantité : {line.quantity}</span>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-8 rounded-full border-[#737373] text-black sm:size-10"
                                disabled={busy || atMin}
                                onClick={() => onQuantityChange(line.quantity - 1)}
                                aria-label="Diminuer la quantité"
                            >
                                <Minus className="size-4 sm:size-5" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-8 rounded-full border-[#737373] text-black sm:size-10"
                                disabled={busy || atMax}
                                onClick={() => onQuantityChange(line.quantity + 1)}
                                aria-label="Augmenter la quantité"
                            >
                                <Plus className="size-4 sm:size-5" />
                            </Button>
                        </div>
                    </div>
                    <p className="font-poppins text-xl font-semibold text-black sm:text-2xl">
                        {line.line_total.toFixed(2)} $
                    </p>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    className="font-poppins h-auto w-fit p-0 text-xs font-semibold uppercase tracking-wide text-[#737373] hover:bg-transparent hover:text-black sm:text-sm"
                    disabled={busy}
                    onClick={onRemove}
                >
                    Supprimer
                </Button>
            </div>
        </article>
    );
}
