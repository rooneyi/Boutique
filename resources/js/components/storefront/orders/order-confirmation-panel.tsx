import { Link } from '@inertiajs/react';
import { AlertCircle, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type OrderForWhatsApp = {
    id: number;
    total_amount: number;
    shipping_full_name?: string | null;
    shipping_whatsapp?: string | null;
    shipping_address?: string | null;
    shipping_city?: string | null;
    shipping_district?: string | null;
    payment_method?: string | null;
    customer_note?: string | null;
    items: {
        product_name: string;
        quantity: number;
        line_total: number;
    }[];
};

type Props = {
    order: OrderForWhatsApp;
    whatsappPhone: string;
    supportPhone: string;
    supportEmail: string;
};

function paymentLabel(method: string | null | undefined): string {
    if (method === 'mobile_money') {
        return 'Mobile Money';
    }
    if (method === 'cash_on_delivery') {
        return 'Paiement à la livraison';
    }
    return '—';
}

export function OrderConfirmationPanel({
    order,
    whatsappPhone,
    supportPhone,
    supportEmail,
}: Props) {
    function openWhatsApp() {
        const itemsText = order.items
            .map((i) => `- ${i.product_name} x${i.quantity} : ${i.line_total.toFixed(2)} $`)
            .join('\n');

        const message = [
            `Bonjour PCJ, je confirme ma commande #${order.id} :`,
            '',
            `Nom : ${order.shipping_full_name ?? '—'}`,
            `WhatsApp : ${order.shipping_whatsapp ?? '—'}`,
            `Adresse : ${order.shipping_address ?? '—'}`,
            `${order.shipping_city ?? '—'}, ${order.shipping_district ?? '—'}`,
            `Paiement : ${paymentLabel(order.payment_method)}`,
            order.customer_note ? `Note : ${order.customer_note}` : '',
            '',
            'Articles :',
            itemsText,
            '',
            `Total : ${order.total_amount.toFixed(2)} $`,
        ]
            .filter(Boolean)
            .join('\n');

        window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
    }

    return (
        <div className="flex w-full max-w-[412px] flex-col items-center gap-7 rounded-[20px] bg-[#f4f9f6] px-4 py-5 shadow-[0_0_2px_rgba(0,0,0,0.25)]">
            <div className="flex max-w-[356px] flex-col items-center gap-3 text-center">
                <MessageCircle className="size-[71px] text-[#068130]" strokeWidth={1.25} />
                <h2 className="font-poppins text-2xl font-semibold text-black">
                    Confirmer via Whatsapp
                </h2>
                <p className="text-sm leading-relaxed text-[rgba(91,94,100,0.62)]">
                    Cliquez sur le bouton ci-dessous pour envoyer votre commande directement à notre
                    équipe sur Whatsapp. Nous vous répondrons dans les plus brefs délais.
                </p>
            </div>

            <div className="flex w-full max-w-[374px] flex-col gap-3">
                <Button
                    type="button"
                    onClick={openWhatsApp}
                    className={cn(
                        'font-poppins h-auto w-full rounded-[22px] border border-black bg-[#068130] py-5 text-xl font-semibold text-white hover:bg-[#056b28]',
                    )}
                >
                    Confirmer via Whatsapp
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="font-poppins h-auto w-full rounded-[22px] border border-black bg-white py-5 text-xl font-normal text-black hover:bg-neutral-50"
                    asChild
                >
                    <Link href={route('home')}>
                        <Home className="size-4" />
                        Retour à l&apos;accueil
                    </Link>
                </Button>
            </div>

            <div className="w-full max-w-[342px] rounded-[20px] bg-white px-4 py-4">
                <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="size-6 shrink-0 text-black" />
                    <h3 className="font-poppins text-xl font-medium text-black">                    Besoin d&apos;aide</h3>
                </div>
                <p className="text-sm leading-relaxed text-[rgba(91,94,100,0.62)]">
                    Contactez-nous WhatsApp au{' '}
                    <span className="font-medium text-black">{supportPhone}</span>
                    <br />
                    ou par email :{' '}
                    <a
                        href={`mailto:${supportEmail}`}
                        className="font-medium text-black hover:underline"
                    >
                        {supportEmail}
                    </a>
                </p>
            </div>
        </div>
    );
}
