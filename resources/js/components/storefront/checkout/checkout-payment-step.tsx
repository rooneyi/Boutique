import { MessageCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import type {
    CheckoutFormData,
    PaymentMethod,
    PaymentProvider,
} from '@/components/storefront/checkout/checkout-form-data';
import { Button } from '@/components/ui/button';
import { CHECKOUT_PAYMENT_ASSETS } from '@/lib/home-assets';
import { cn } from '@/lib/utils';

type Props = {
    data: CheckoutFormData;
    errors: Partial<Record<keyof CheckoutFormData | 'cart', string>>;
    setData: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void;
    onWhatsApp: () => void;
};

const PAYMENT_OPTIONS: {
    provider: PaymentProvider;
    method: PaymentMethod;
    label: string;
    image: string;
}[] = [
    { provider: 'airtel', method: 'mobile_money', label: 'Airtel money', image: CHECKOUT_PAYMENT_ASSETS.airtel },
    { provider: 'orange', method: 'mobile_money', label: 'Orange money', image: CHECKOUT_PAYMENT_ASSETS.orange },
    { provider: 'mpesa', method: 'mobile_money', label: 'M-Pesa', image: CHECKOUT_PAYMENT_ASSETS.mpesa },
    { provider: 'card', method: 'mobile_money', label: 'carte de crédit', image: CHECKOUT_PAYMENT_ASSETS.card },
];

export function CheckoutPaymentStep({ data, errors, setData, onWhatsApp }: Props) {
    function selectPayment(method: PaymentMethod, provider: PaymentProvider) {
        setData('payment_method', method);
        setData('payment_provider', provider);
    }

    const selectedKey = `${data.payment_method}:${data.payment_provider ?? ''}`;

    return (
        <div className="flex min-h-[531px] flex-col gap-[18px] border-[0.5px] border-black bg-white px-6 py-7 sm:px-9 sm:py-7">
            <h2 className="font-poppins text-2xl font-semibold text-black">Méthode de paiement</h2>

            <InputError message={errors.payment_method} />

            <div className="flex flex-col gap-[18px]">
                {PAYMENT_OPTIONS.map((option) => {
                    const key = `${option.method}:${option.provider}`;
                    const selected = selectedKey === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => selectPayment(option.method, option.provider)}
                            className={cn(
                                'flex w-full items-center gap-2.5 rounded-sm p-2.5 text-left transition-colors hover:bg-neutral-50',
                                selected && 'bg-[#0059DD]/5 ring-1 ring-[#0059DD]',
                            )}
                        >
                            <span className="relative size-[50px] shrink-0 overflow-hidden rounded-full bg-white">
                                <img
                                    src={option.image}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            </span>
                            <span className="font-poppins text-xl font-medium uppercase text-black">
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col items-center gap-[18px]">
                <div className="flex w-full items-center gap-[5px]">
                    <span className="h-px flex-1 bg-[#8a8a8a]" aria-hidden />
                    <span className="font-poppins text-xs text-[#8a8a8a]">Ou</span>
                    <span className="h-px flex-1 bg-[#8a8a8a]" aria-hidden />
                </div>

                <Button
                    type="button"
                    onClick={onWhatsApp}
                    className="font-poppins flex h-auto w-full items-center justify-center gap-1 rounded-[32px] border-[0.5px] border-[rgba(91,94,100,0.62)] bg-[#08be3f] py-3.5 text-xl font-semibold text-white hover:bg-[#07a838]"
                >
                    <MessageCircle className="size-[35px] shrink-0" strokeWidth={1.25} />
                    Confirmer via WhatsApp
                </Button>
            </div>

            <InputError message={errors.cart} />
        </div>
    );
}
