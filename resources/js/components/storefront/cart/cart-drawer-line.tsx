import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { cn } from '@/lib/utils';

type Props = {
    line: CartLine;
    busy: boolean;
    showRemove: boolean;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
};

export function CartDrawerLine({
    line,
    busy,
    showRemove,
    onQuantityChange,
    onRemove,
}: Props) {
    const atMin = line.quantity <= 1;
    const atMax = line.quantity >= line.stock;

    return (
        <article className="relative flex flex-col gap-4 border-b border-[#e8e8e8] pb-8 last:border-b-0 sm:flex-row sm:gap-2.5">
            <div className="mx-auto h-[160px] w-full max-w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-neutral-100 sm:mx-0 sm:h-[186px] sm:w-[170px]">
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

            <div className="relative min-w-0 flex-1">
                {showRemove && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 size-[30px] text-[#737373] hover:bg-neutral-100 hover:text-black"
                        disabled={busy}
                        onClick={onRemove}
                        aria-label="Retirer du panier"
                    >
                        <Trash2 className="size-6" strokeWidth={1.25} />
                    </Button>
                )}

                <div className="flex flex-col gap-2 pr-8 sm:pr-10">
                    <h3 className="font-poppins text-xl font-bold leading-snug text-black sm:text-[28px]">
                        {line.name}
                    </h3>
                    <p className="font-poppins text-base font-medium text-[#737373] sm:text-xl">
                        Couleur : Noir
                    </p>
                    <p className="font-poppins text-base font-medium text-[#737373] sm:text-xl">
                        Taille : M
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                        <div
                            className={cn(
                                'inline-flex items-center gap-6 rounded-[25px] border border-[rgba(91,94,100,0.62)] px-2 py-1 sm:gap-10',
                                busy && 'pointer-events-none opacity-60',
                            )}
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-full text-black hover:bg-neutral-100"
                                disabled={busy || atMin}
                                onClick={() => onQuantityChange(line.quantity - 1)}
                                aria-label="Diminuer la quantité"
                            >
                                <Minus className="size-5" />
                            </Button>
                            <span className="font-poppins min-w-[1.25rem] text-center text-xl font-normal text-black sm:text-2xl">
                                {line.quantity}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 rounded-full text-black hover:bg-neutral-100"
                                disabled={busy || atMax}
                                onClick={() => onQuantityChange(line.quantity + 1)}
                                aria-label="Augmenter la quantité"
                            >
                                <Plus className="size-5" />
                            </Button>
                        </div>
                        <p className="font-poppins text-xl font-medium text-black sm:text-2xl">
                            {line.line_total.toFixed(2)} $
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
