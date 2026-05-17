import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { SF_PILL_BTN_DARK, SF_PILL_BTN_LIGHT } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    subtotal: number;
    shipping: number;
    total: number;
};

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)} $`;
}

export function CartSummaryPanel({ subtotal, shipping, total }: Props) {
    return (
        <aside className="h-fit w-full shrink-0 rounded-sm border border-[#e8e8e8] bg-white p-6 lg:sticky lg:top-28 lg:w-[471px] lg:p-8">
            <div className="space-y-4 border-b border-[#e8e8e8] pb-6">
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
                <div className="flex items-center justify-between gap-4 pt-2">
                    <span className="font-poppins text-sm font-semibold uppercase tracking-wide text-black">
                        Coupons
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        className="font-poppins h-9 rounded-full border-black px-4 text-xs font-semibold uppercase"
                        onClick={() =>
                            toast.message('Bientôt disponible', {
                                description: 'Les codes promo seront activés prochainement.',
                            })
                        }
                    >
                        Ajouter
                    </Button>
                </div>
            </div>

            <p className="font-poppins mt-6 text-sm leading-relaxed text-[#737373]">
                En passant commande, vous acceptez les conditions générales de vente et la
                politique de confidentialité de PCJ. Les articles restent réservés jusqu’à la
                validation du paiement.
            </p>

            <div className="mt-8 flex items-center justify-between border-t border-[#e8e8e8] pt-6">
                <span className="font-poppins text-2xl font-semibold text-black">Total</span>
                <span className="font-poppins text-2xl font-semibold text-[#0059DD]">
                    {formatMoney(total)}
                </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Button
                    type="button"
                    className={cn(SF_PILL_BTN_DARK, 'h-14 w-full text-sm uppercase')}
                    onClick={() =>
                        toast.message('Paiement à venir', {
                            description:
                                'Le passage de commande sécurisé sera disponible dans une prochaine étape.',
                        })
                    }
                >
                    Passer la commande
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(SF_PILL_BTN_LIGHT, 'h-14 w-full border-black text-sm uppercase')}
                    asChild
                >
                    <Link href={route('customer.products.index')}>Retour</Link>
                </Button>
            </div>
        </aside>
    );
}
