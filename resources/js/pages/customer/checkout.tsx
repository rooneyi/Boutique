import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { CheckoutBreadcrumbs } from '@/components/storefront/checkout/checkout-breadcrumbs';
import type { CheckoutFormData, CheckoutStep } from '@/components/storefront/checkout/checkout-form-data';
import { CheckoutOrderSummary } from '@/components/storefront/checkout/checkout-order-summary';
import { CheckoutPaymentStep } from '@/components/storefront/checkout/checkout-payment-step';
import { CheckoutShippingStep } from '@/components/storefront/checkout/checkout-shipping-step';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { Button } from '@/components/ui/button';
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

function paymentLabel(data: CheckoutFormData): string {
    if (data.payment_method === 'cash_on_delivery') {
        return 'Paiement à la livraison';
    }
    const labels: Record<string, string> = {
        airtel: 'Airtel Money',
        orange: 'Orange Money',
        mpesa: 'M-Pesa',
        card: 'Carte bancaire',
    };
    return data.payment_provider ? labels[data.payment_provider] ?? 'Mobile Money' : 'Mobile Money';
}

export default function CustomerCheckout() {
    const { auth, canRegister, lines, subtotal, shipping, total, defaults, whatsappPhone } =
        usePage<PageProps>().props;

    const [step, setStep] = useState<CheckoutStep>('shipping');
    const { data, setData, post, processing, errors } = useForm<CheckoutFormData>(defaults);

    function validateShipping(): boolean {
        if (!data.shipping_full_name.trim() || !data.shipping_whatsapp.trim()) {
            return false;
        }
        if (data.delivery_method === 'home_delivery') {
            return (
                !!data.shipping_address.trim() &&
                !!data.shipping_city.trim() &&
                !!data.shipping_district.trim()
            );
        }
        return true;
    }

    function goToPayment() {
        if (!validateShipping()) {
            return;
        }
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (step === 'shipping') {
            goToPayment();
            return;
        }
        post(route('customer.checkout.store'));
    }

    function openWhatsApp() {
        const itemsText = lines
            .map((l) => `- ${l.name} x${l.quantity} : ${l.line_total.toFixed(2)} $`)
            .join('\n');

        const deliveryLabel =
            data.delivery_method === 'store_pickup' ? 'Retrait en boutique' : 'Livraison à domicile';

        const message = [
            'Bonjour PCJ, je souhaite passer commande :',
            '',
            `Nom : ${data.shipping_full_name || '—'}`,
            `WhatsApp : ${data.shipping_whatsapp || '—'}`,
            `Livraison : ${deliveryLabel}`,
            data.delivery_method === 'home_delivery'
                ? `Adresse : ${data.shipping_address || '—'}`
                : null,
            data.delivery_method === 'home_delivery'
                ? `${data.shipping_city || '—'}, ${data.shipping_district || '—'}`
                : null,
            `Paiement : ${paymentLabel(data)}`,
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

    const pageTitle = step === 'shipping' ? 'Livraison' : 'Paiement';

    return (
        <>
            <Head title={`${pageTitle} · PCJ`} />

            <div className="min-h-screen bg-[#f8f7f9] font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={SF_PAGE_MAIN}>
                    <div className="mx-auto max-w-[1440px]">
                        <h1 className={cn(SF_PAGE_TITLE, 'pt-4 pb-2 text-center sm:pt-6 sm:text-left')}>
                            {pageTitle}
                        </h1>
                        <CheckoutBreadcrumbs step={step} />

                        <form
                            onSubmit={submit}
                            className="mt-6 flex flex-col gap-8 lg:mt-8 lg:flex-row lg:items-start lg:gap-12"
                        >
                            <div className="min-w-0 flex-1 lg:max-w-[769px]">
                                {step === 'payment' ? (
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="font-poppins mb-4 h-auto p-0 text-sm font-medium text-[#0059DD]"
                                        onClick={() => setStep('shipping')}
                                    >
                                        ← Retour à la livraison
                                    </Button>
                                ) : null}

                                {step === 'shipping' ? (
                                    <CheckoutShippingStep
                                        data={data}
                                        errors={errors}
                                        setData={setData}
                                    />
                                ) : (
                                    <CheckoutPaymentStep
                                        data={data}
                                        errors={errors}
                                        setData={setData}
                                    />
                                )}
                            </div>

                            <CheckoutOrderSummary
                                lines={lines}
                                subtotal={subtotal}
                                shipping={shipping}
                                total={total}
                                step={step}
                                processing={processing}
                                onContinue={goToPayment}
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
