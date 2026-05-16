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
        <article className="relative flex gap-2.5">
            <div className="h-[186px] w-[170px] shrink-0 overflow-hidden rounded-[10px] bg-neutral-100">
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
                        className="absolute top-2 right-0.5 size-[30px] text-[#737373] hover:bg-neutral-100 hover:text-black"
                        disabled={busy}
                        onClick={onRemove}
                        aria-label="Retirer du panier"
                    >
                        <Trash2 className="size-6" strokeWidth={1.25} />
                    </Button>
                )}

                <div className="flex flex-col gap-2.5 pr-10">
                    <h3 className="font-poppins text-[28px] font-bold leading-normal text-black">
                        {line.name}
                    </h3>
                    <p className="font-poppins text-xl font-medium text-[#737373]">
                        Couleur : Noir
                    </p>
                    <p className="font-poppins text-xl font-medium text-[#737373]">
                        Taille : M
                    </p>

                    <div className="mt-1 flex items-center justify-between gap-4">
                        <div
                            className={cn(
                                'inline-flex items-center gap-10 rounded-[25px] border border-[rgba(91,94,100,0.62)] px-2 py-1',
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
                            <span className="font-poppins min-w-[1.25rem] text-center text-2xl font-normal leading-[1.24] text-black">
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
                        <p className="font-poppins shrink-0 text-2xl font-medium text-black">
                            {line.line_total.toFixed(2)} $
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
