import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { cn } from '@/lib/utils';

type Props = {
    line: CartLine;
    busy: boolean;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
};

export function CartDrawerLine({ line, busy, onQuantityChange, onRemove }: Props) {
    const atMin = line.quantity <= 1;
    const atMax = line.quantity >= line.stock;

    return (
        <article className="relative flex flex-col gap-5 border-b border-[#e8e8e8] py-8 last:border-b-0 sm:flex-row">
            <div className="mx-auto h-[140px] w-full max-w-[170px] shrink-0 overflow-hidden rounded-[10px] bg-neutral-100 sm:mx-0 sm:h-[186px] sm:w-[170px]">
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
            </div>

            <div className="min-w-0 flex-1 pt-1">
                <h3 className="font-poppins pr-10 text-[28px] font-bold leading-tight text-black">
                    {line.name}
                </h3>
                <p className="font-poppins mt-3 text-xl text-[#737373]">Couleur : Noir</p>
                <p className="font-poppins text-xl text-[#737373]">Taille : M</p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div
                        className={cn(
                            'inline-flex h-10 items-center gap-4 rounded-full border border-[#d9d9d9] px-4',
                            busy && 'pointer-events-none opacity-60',
                        )}
                    >
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full text-black hover:bg-neutral-100"
                            disabled={busy || atMin}
                            onClick={() => onQuantityChange(line.quantity - 1)}
                            aria-label="Diminuer la quantité"
                        >
                            <Minus className="size-4" />
                        </Button>
                        <span className="font-poppins min-w-[1.5rem] text-center text-lg font-semibold text-black">
                            {line.quantity}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-full text-black hover:bg-neutral-100"
                            disabled={busy || atMax}
                            onClick={() => onQuantityChange(line.quantity + 1)}
                            aria-label="Augmenter la quantité"
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>
                    <p className="font-poppins text-[28px] font-bold text-black">
                        {line.line_total.toFixed(2)} $
                    </p>
                </div>
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-6 right-0 size-10 text-[#737373] hover:bg-neutral-100 hover:text-black"
                disabled={busy}
                onClick={onRemove}
                aria-label="Retirer du panier"
            >
                <Trash2 className="size-6" strokeWidth={1.25} />
            </Button>
        </article>
    );
}
