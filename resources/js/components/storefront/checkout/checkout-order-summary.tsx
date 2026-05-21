import { Link } from '@inertiajs/react';
import { MessageCircle, ShieldCheck, ShoppingBag } from 'lucide-react';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import type { CheckoutStep } from '@/components/storefront/checkout/checkout-form-data';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    lines: CartLine[];
    subtotal: number;
    shipping: number;
    total: number;
    step: CheckoutStep;
    processing: boolean;
    onContinue?: () => void;
    onWhatsApp: () => void;
};

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)} $`;
}

export function CheckoutOrderSummary({
    lines,
    subtotal,
    shipping,
    total,
    step,
    processing,
    onContinue,
    onWhatsApp,
}: Props) {
    return (
        <aside className="h-fit w-full shrink-0 rounded-[20px] border border-[#e8e8e8] bg-white px-6 py-5 shadow-[0_0_2px_rgba(0,0,0,0.12)] lg:sticky lg:top-28 lg:w-[471px] lg:rounded-sm lg:p-8 lg:shadow-none">
            <h2 className="font-poppins mb-4 text-2xl font-semibold text-black">
                Récapitulatif de commande
            </h2>

            <div className="space-y-5">
                {lines.map((line) => (
                    <div
                        key={`${line.product_id}-${line.variant_id ?? 0}`}
                        className="flex gap-5"
                    >
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
                                    {line.name.split(' — ')[0]}
                                </p>
                                {line.size ? (
                                    <p className="mt-1 text-sm text-[rgba(91,94,100,0.62)]">
                                        Tailles : {line.size}
                                    </p>
                                ) : null}
                                {line.color ? (
                                    <p className="text-sm text-[rgba(91,94,100,0.62)]">
                                        Couleur : {line.color}
                                    </p>
                                ) : null}
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

            <div className="my-6 space-y-4 border-y border-[#e8e8e8] py-6">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-poppins text-lg font-medium text-[#737373]">
                        Valeur commande
                    </span>
                    <span className="font-poppins text-lg font-semibold text-black">
                        {formatMoney(subtotal)}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-poppins text-lg font-medium text-[#737373]">
                        Frais de livraison
                    </span>
                    <span className="font-poppins text-lg font-semibold text-[#0059DD]">
                        {shipping <= 0 ? 'Gratuit' : formatMoney(shipping)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <span className="font-poppins text-2xl font-semibold text-black">Total</span>
                <span className="font-poppins text-2xl font-semibold text-[#0059DD]">
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
                {step === 'shipping' ? (
                    <Button
                        type="button"
                        disabled={lines.length === 0}
                        className={cn(
                            'font-poppins h-auto w-full max-w-[374px] rounded-[22px] border border-black bg-black py-5 text-xl font-normal text-white hover:bg-neutral-800',
                        )}
                        onClick={onContinue}
                    >
                        Continuer vers le paiement
                    </Button>
                ) : (
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
                )}
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
