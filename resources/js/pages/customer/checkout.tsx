import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { CheckoutBreadcrumbs } from '@/components/storefront/checkout/checkout-breadcrumbs';
import type { CheckoutFormData, CheckoutStep, PaymentProvider } from '@/components/storefront/checkout/checkout-form-data';
import { CheckoutOrderSummary } from '@/components/storefront/checkout/checkout-order-summary';
import { CheckoutPaymentSimulation } from '@/components/storefront/checkout/checkout-payment-simulation';
import { CheckoutPaymentStep } from '@/components/storefront/checkout/checkout-payment-step';
import { CheckoutPaymentSummary } from '@/components/storefront/checkout/checkout-payment-summary';
import { CheckoutShippingStep } from '@/components/storefront/checkout/checkout-shipping-step';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { useOptionalAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { route } from '@/lib/route';
import { isValidFullPhone, isValidMobileMoneyPhone, mobileMoneyPhoneError } from '@/lib/phone';
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
    const [simulatingProvider, setSimulatingProvider] = useState<PaymentProvider | null>(null);
    const [confirmedProvider, setConfirmedProvider] = useState<PaymentProvider | null>(null);
    const { data, setData, post, processing, errors, setError, clearErrors } = useForm<CheckoutFormData>(defaults);
    const accountDrawer = useOptionalAccountDrawer();

    const isCustomer = auth?.user?.role === 'CUSTOMER';

    function validateShipping(): boolean {
        clearErrors();
        const isPickup = data.delivery_method === 'store_pickup';
        let valid = true;

        if (!data.shipping_full_name.trim()) {
            setError('shipping_full_name', 'Le nom complet est requis.');
            valid = false;
        }
        if (!data.shipping_whatsapp.trim() || !isValidFullPhone(data.shipping_whatsapp)) {
            setError(
                'shipping_whatsapp',
                'Le numéro doit contenir 9 chiffres après l’indicatif, ou 10 chiffres en commençant par 0.',
            );
            valid = false;
        }
        if (!isPickup) {
            if (!data.shipping_address.trim()) {
                setError('shipping_address', "L'adresse complète est requise.");
                valid = false;
            }
            if (!data.shipping_city.trim()) {
                setError('shipping_city', 'La ville ou commune est requise.');
                valid = false;
            }
            if (!data.shipping_district.trim()) {
                setError('shipping_district', 'Le quartier est requis.');
                valid = false;
            }
        }
        return valid;
    }

    function goToPayment() {
        if (!validateShipping()) {
            return;
        }
        if (!isCustomer) {
            accountDrawer?.openAccount();
            return;
        }
        setStep('payment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleSelectProvider(provider: PaymentProvider) {
        if (!provider) {
            return;
        }

        if (
            (provider === 'airtel' || provider === 'orange' || provider === 'mpesa') &&
            !data.payment_phone.trim() &&
            data.shipping_whatsapp.trim()
        ) {
            setData('payment_phone', data.shipping_whatsapp);
        }
        setSimulatingProvider(provider);
    }

    function confirmPaymentSimulation(confirmedPhone: string) {
        const provider = simulatingProvider;
        if (!provider) {
            return;
        }

        if (['airtel', 'orange', 'mpesa'].includes(provider)) {
            if (!isValidMobileMoneyPhone(confirmedPhone, provider)) {
                setError('payment_phone', mobileMoneyPhoneError(provider));
                return;
            }
            setData('payment_phone', confirmedPhone);
            clearErrors('payment_phone');
        }

        setData('payment_provider', provider);
        setConfirmedProvider(provider);
        setSimulatingProvider(null);
        clearErrors('payment_confirmed');
    }

    function cancelPaymentSimulation() {
        setSimulatingProvider(null);
        if (confirmedProvider) {
            setData('payment_provider', confirmedProvider);
        }
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (step === 'shipping') {
            goToPayment();
            return;
        }

        if (!confirmedProvider) {
            setError(
                'payment_confirmed',
                'Veuillez choisir un opérateur et confirmer le paiement avant de valider la commande.',
            );
            return;
        }

        if (
            data.payment_method === 'mobile_money' &&
            data.payment_provider &&
            ['airtel', 'orange', 'mpesa'].includes(data.payment_provider) &&
            !isValidFullPhone(data.payment_phone)
        ) {
            setError(
                'payment_phone',
                'Indiquez le numéro Mobile Money utilisé pour le paiement.',
            );
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
            data.payment_phone &&
            data.payment_provider &&
            ['airtel', 'orange', 'mpesa'].includes(data.payment_provider)
                ? `Mobile Money : ${data.payment_phone}`
                : null,
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
                                            confirmedProvider={confirmedProvider}
                                            setData={setData}
                                            onSelectProvider={handleSelectProvider}
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
                                        total={total}
                                        processing={processing}
                                        confirmedProvider={confirmedProvider}
                                        onBack={() => {
                                            setConfirmedProvider(null);
                                            setStep('shipping');
                                        }}
                                    />
                                )}
                            </form>
                        </div>
                    </div>
                </main>

                <HomeFooter />
                <FlashToaster />

                {simulatingProvider ? (
                    <CheckoutPaymentSimulation
                        provider={simulatingProvider}
                        amount={total}
                        phone={
                            data.payment_phone.trim() ||
                            data.shipping_whatsapp ||
                            ''
                        }
                        whatsappPhone={data.shipping_whatsapp}
                        onConfirm={confirmPaymentSimulation}
                        onCancel={cancelPaymentSimulation}
                    />
                ) : null}
            </div>
        </>
    );
}
