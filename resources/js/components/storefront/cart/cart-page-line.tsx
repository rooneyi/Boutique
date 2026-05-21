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
        <article className="flex gap-5">
            <div className="relative h-[284px] w-[218px] shrink-0 overflow-hidden rounded-[20px] bg-neutral-100">
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
                    className="font-poppins text-2xl font-bold text-black hover:text-[#0059DD]"
                >
                    {displayName}
                </Link>
                <p className="font-poppins text-xl text-black">{formatMoney(line.price)}</p>
                {line.size ? (
                    <p className="font-poppins text-xl text-black">Taille : {line.size}</p>
                ) : null}
                {line.color ? (
                    <p className="font-poppins text-xl text-black">Couleur : {line.color}</p>
                ) : null}

                <div
                    className={cn(
                        'flex items-center gap-8',
                        busy && 'pointer-events-none opacity-60',
                    )}
                >
                    <span className="font-poppins text-xl text-black">
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

                <p className="font-poppins text-xl text-black">
                    Total : {formatMoney(line.line_total)}
                </p>

                <button
                    type="button"
                    className="font-poppins w-fit text-left text-xl text-[rgba(91,94,100,0.62)] uppercase hover:text-black disabled:opacity-60"
                    disabled={busy}
                    onClick={onRemove}
                >
                    Supprimer
                </button>
            </div>
        </article>
    );
}
