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

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)}$`;
}

export function CartPageLine({ line, busy, onQuantityChange, onRemove }: Props) {
    const atMin = line.quantity <= 1;
    const atMax = line.quantity >= line.stock;
    const displayName = line.name.split(' — ')[0];

    return (
        <article className="flex flex-col gap-5 sm:flex-row sm:gap-5">
            <div className="relative mx-auto h-[min(220px,50vw)] w-full max-w-[218px] shrink-0 overflow-hidden rounded-[20px] bg-neutral-100 sm:mx-0 sm:h-[284px] sm:w-[218px]">
                <Link
                    href={route('customer.products.show', line.product_id)}
                    className="block size-full"
                >
                    {line.image_path ? (
                        <img src={line.image_path} alt="" className="size-full object-cover" />
                    ) : (
                        <div className="flex size-full items-center justify-center text-sm text-[#737373]">
                            —
                        </div>
                    )}
                </Link>
                <FavoriteButton
                    productId={line.product_id}
                    favorited={line.is_favorite ?? false}
                    openDrawerOnAdd={false}
                    className="absolute top-3 right-3 size-9 rounded-full border border-white bg-white p-2 shadow-sm hover:bg-white sm:size-10"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <Link
                    href={route('customer.products.show', line.product_id)}
                    className="font-poppins text-xl font-bold text-black hover:text-[#0059DD] sm:text-2xl"
                >
                    {displayName}
                </Link>
                <p className="font-poppins text-lg text-black sm:text-xl">{formatMoney(line.price)}</p>
                {line.size ? (
                    <p className="font-poppins text-lg text-black sm:text-xl">Taille : {line.size}</p>
                ) : null}
                {line.color ? (
                    <p className="font-poppins text-lg text-black sm:text-xl">Couleur : {line.color}</p>
                ) : null}

                <div
                    className={cn(
                        'flex flex-wrap items-center gap-4 sm:gap-8',
                        busy && 'pointer-events-none opacity-60',
                    )}
                >
                    <span className="font-poppins text-lg text-black sm:text-xl">
                        Quantité : {line.quantity}
                    </span>
                    <div className="flex items-center gap-2.5">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-6 text-black hover:bg-neutral-100"
                            disabled={busy || atMin}
                            onClick={() => onQuantityChange(line.quantity - 1)}
                            aria-label="Diminuer la quantité"
                        >
                            <Minus className="size-6" strokeWidth={1.25} />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-6 text-black hover:bg-neutral-100"
                            disabled={busy || atMax}
                            onClick={() => onQuantityChange(line.quantity + 1)}
                            aria-label="Augmenter la quantité"
                        >
                            <Plus className="size-6" strokeWidth={1.25} />
                        </Button>
                    </div>
                </div>

                <p className="font-poppins text-lg text-black sm:text-xl">
                    Total : {formatMoney(line.line_total)}
                </p>

                <button
                    type="button"
                    className="font-poppins w-fit text-left text-lg text-[rgba(91,94,100,0.62)] uppercase hover:text-black disabled:opacity-60 sm:text-xl"
                    disabled={busy}
                    onClick={onRemove}
                >
                    SUPPRIMER
                </button>
            </div>
        </article>
    );
}
