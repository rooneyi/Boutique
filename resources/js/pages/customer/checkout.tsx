import { Head, useForm, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { CheckoutBreadcrumbs } from '@/components/storefront/checkout/checkout-breadcrumbs';
import {
    CheckoutFormFields,
    type CheckoutFormData,
} from '@/components/storefront/checkout/checkout-form-fields';
import { CheckoutSummary } from '@/components/storefront/checkout/checkout-summary';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { route } from '@/lib/route';
import { SF_PAGE_MAIN, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type AuthUser = {
    id: number;
    name?: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    lines: CartLine[];
    subtotal: number;
    shipping: number;
    total: number;
    canRegister: boolean;
    defaults: CheckoutFormData;
    whatsappPhone: string;
    auth?: { user?: AuthUser | null };
};

export default function CustomerCheckout() {
    const { auth, canRegister, lines, subtotal, shipping, total, defaults, whatsappPhone } =
        usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<CheckoutFormData>(defaults);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('customer.checkout.store'));
    }

    function openWhatsApp() {
        const itemsText = lines
            .map((l) => `- ${l.name} x${l.quantity} : ${l.line_total.toFixed(2)} $`)
            .join('\n');

        const message = [
            'Bonjour PCJ, je souhaite passer commande :',
            '',
            `Nom : ${data.shipping_full_name || '—'}`,
            `WhatsApp : ${data.shipping_whatsapp || '—'}`,
            `Adresse : ${data.shipping_address || '—'}`,
            `${data.shipping_city || '—'}, ${data.shipping_district || '—'}`,
            `Paiement : ${data.payment_method === 'mobile_money' ? 'Mobile Money' : 'À la livraison'}`,
            data.customer_note ? `Note : ${data.customer_note}` : '',
            '',
            'Articles :',
            itemsText,
            '',
            `Total : ${total.toFixed(2)} $`,
        ]
            .filter(Boolean)
            .join('\n');

        window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
    }

    return (
        <>
            <Head title="Commande · PCJ" />

            <div className="min-h-screen bg-[#f8f7f9] font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={SF_PAGE_MAIN}>
                    <div className="mx-auto max-w-[1440px]">
                        <h1 className={cn(SF_PAGE_TITLE, 'pt-4 pb-2 text-center sm:pt-6 sm:text-left')}>
                            Finaliser la commande
                        </h1>
                        <CheckoutBreadcrumbs />

                        <form
                            onSubmit={submit}
                            className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:items-start lg:gap-12"
                        >
                            <div className="min-w-0 flex-1 max-w-[765px]">
                                <CheckoutFormFields
                                    data={data}
                                    errors={errors}
                                    setData={setData}
                                />
                            </div>

                            <CheckoutSummary
                                lines={lines}
                                subtotal={subtotal}
                                shipping={shipping}
                                total={total}
                                processing={processing}
                                onWhatsApp={openWhatsApp}
                            />
                        </form>
                    </div>
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
