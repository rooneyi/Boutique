import { Link } from '@inertiajs/react';
import { MessageCircle, ShieldCheck, ShoppingBag } from 'lucide-react';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    lines: CartLine[];
    subtotal: number;
    shipping: number;
    total: number;
    processing: boolean;
    onWhatsApp: () => void;
};

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)} $`;
}

export function CheckoutSummary({
    lines,
    subtotal,
    shipping,
    total,
    processing,
    onWhatsApp,
}: Props) {
    return (
        <aside className="h-fit w-full shrink-0 rounded-[20px] bg-white px-6 py-5 shadow-[0_0_2px_rgba(0,0,0,0.25)] lg:sticky lg:top-28 lg:max-w-[420px]">
            <h2 className="font-poppins mb-4 text-2xl font-semibold text-black">
                Récapitulatif de commande
            </h2>

            <div className="space-y-5">
                {lines.map((line) => (
                    <div key={line.product_id} className="flex gap-5">
                        <div className="h-[120px] w-[117px] shrink-0 overflow-hidden rounded-[20px] bg-neutral-100">
                            {line.image_path ? (
                                <img
                                    src={line.image_path}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-xs text-[#737373]">
                                    —
                                </div>
                            )}
                        </div>
                        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                            <div>
                                <p className="font-poppins text-xl font-medium text-black">
                                    {line.name}
                                </p>
                                <p className="mt-1 text-sm text-[rgba(91,94,100,0.62)]">
                                    Tailles : M
                                </p>
                                <p className="text-sm text-[rgba(91,94,100,0.62)]">Couleur : Blanc</p>
                                <p className="text-sm text-[rgba(91,94,100,0.62)]">
                                    Quantité : {line.quantity}
                                </p>
                            </div>
                            <p className="font-poppins shrink-0 text-xl font-medium text-[#0059DD]">
                                {formatMoney(line.line_total)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="my-6 space-y-5 border-y border-neutral-100 py-6 text-lg text-black">
                <div className="flex items-center justify-between">
                    <span>Sous-total</span>
                    <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Livraison</span>
                    <span className="text-[rgba(91,94,100,0.62)]">
                        {shipping <= 0 ? 'free' : formatMoney(shipping)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <span className="font-poppins text-3xl font-semibold text-black">Total</span>
                <span className="font-poppins text-3xl font-semibold text-black">
                    {formatMoney(total)}
                </span>
            </div>

            <div className="mt-4 flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-6 shrink-0 text-[rgba(91,94,100,0.62)]" />
                <p className="text-sm leading-snug text-[rgba(91,94,100,0.62)]">
                    Vos données sont sécurisées et confidentielles.
                </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
                <Button
                    type="submit"
                    disabled={processing || lines.length === 0}
                    className={cn(
                        'font-poppins h-auto w-full max-w-[374px] rounded-[22px] border border-black bg-black py-5 text-xl font-normal text-white hover:bg-neutral-800',
                    )}
                >
                    <ShoppingBag className="size-4" />
                    Valider la commande
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={lines.length === 0}
                    className="font-poppins h-auto w-full max-w-[374px] rounded-[22px] border border-black bg-white py-5 text-xl font-normal text-black hover:bg-neutral-50"
                    onClick={onWhatsApp}
                >
                    <MessageCircle className="size-4" />
                    Commander via WhatsApp
                </Button>
                <Link
                    href={route('customer.cart')}
                    className="font-poppins text-sm font-medium text-[#0059DD] hover:underline"
                >
                    Modifier le panier
                </Link>
            </div>
        </aside>
    );
}
