import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { CheckoutBreadcrumbs } from '@/components/storefront/checkout/checkout-breadcrumbs';
import type { CheckoutFormData, CheckoutStep } from '@/components/storefront/checkout/checkout-form-data';
import { CheckoutOrderSummary } from '@/components/storefront/checkout/checkout-order-summary';
import { CheckoutPaymentStep } from '@/components/storefront/checkout/checkout-payment-step';
import { CheckoutPaymentSummary } from '@/components/storefront/checkout/checkout-payment-summary';
import { CheckoutShippingStep } from '@/components/storefront/checkout/checkout-shipping-step';
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

    const pageTitle = step === 'shipping' ? 'Adresse de livraison' : 'Paiement';
    const pageBg = step === 'payment' ? 'bg-white' : 'bg-[#f8f7f9]';

    return (
        <>
            <Head title={`${pageTitle} · PCJ`} />

            <div className={cn('min-h-screen font-poppins text-black antialiased', pageBg)}>
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={cn(SF_PAGE_MAIN, step === 'payment' && 'bg-white')}>
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-[100px]">
                        <h1
                            className={cn(
                                SF_PAGE_TITLE,
                                'pt-9 pb-0 text-center',
                                step === 'payment' && 'pb-0',
                            )}
                        >
                            {pageTitle}
                        </h1>

                        <div className="mt-[30px] flex flex-col gap-[30px]">
                            <CheckoutBreadcrumbs step={step} />

                            <form onSubmit={submit} className="flex flex-col gap-[30px] lg:flex-row lg:items-start">
                                <div className="min-w-0 flex-1">
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
                                            onWhatsApp={openWhatsApp}
                                        />
                                    )}
                                </div>

                                {step === 'shipping' ? (
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
                                ) : (
                                    <CheckoutPaymentSummary
                                        subtotal={subtotal}
                                        shipping={shipping}
                                        processing={processing}
                                        onBack={() => setStep('shipping')}
                                    />
                                )}
                            </form>
                        </div>
                    </div>
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
