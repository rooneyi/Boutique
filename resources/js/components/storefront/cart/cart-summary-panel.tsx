import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    subtotal: number;
    shipping: number;
    total: number;
};

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)}$`;
}

export function CartSummaryPanel({ subtotal, shipping, total }: Props) {
    return (
        <aside className="flex min-h-[min(531px,70vh)] w-full shrink-0 flex-col justify-between border-[0.5px] border-black bg-white px-6 py-7 sm:px-9 lg:sticky lg:top-28 lg:w-[471px]">
            <div className="font-poppins flex flex-col gap-[77px] text-xl text-black">
                <div className="flex flex-col gap-[18px]">
                    <div className="flex items-center justify-between gap-4">
                        <span>Valeur de la commande</span>
                        <span>{formatMoney(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span>Frais de livraison</span>
                        <span>{shipping <= 0 ? 'Gratuit' : formatMoney(shipping)}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-10 text-xl leading-normal">
                    <p>
                        Retours sous 30 jours. Consultez notre{' '}
                        <span className="underline">politique de retour et de remboursement</span> pour
                        en savoir plus.
                    </p>
                    <p>
                        Besoin d&apos;aide ? Veuillez contacter{' '}
                        <a
                            href="mailto:kambmusene@gmail.com"
                            className="underline hover:text-[#0059DD]"
                        >
                            le service client
                        </a>
                        .
                    </p>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-[18px]">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-poppins text-2xl font-semibold uppercase">Total</span>
                    <span className="font-poppins text-2xl font-semibold">{formatMoney(total)}</span>
                </div>
                <Button
                    type="button"
                    className={cn(
                        'font-poppins h-auto w-full rounded-[32px] border border-black bg-black py-3.5 text-xl font-semibold uppercase text-white hover:bg-neutral-800',
                    )}
                    asChild
                >
                    <Link href={route('customer.checkout')}>Passer la commande</Link>
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="font-poppins h-auto w-full rounded-[32px] border-[0.5px] border-[rgba(91,94,100,0.62)] bg-white py-3.5 text-xl font-semibold uppercase text-black hover:bg-neutral-50"
                    asChild
                >
                    <Link href={route('customer.products.index')}>Retour</Link>
                </Button>
            </div>
        </aside>
    );
}
