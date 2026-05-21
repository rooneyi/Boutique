import { Brush, CreditCard, Smartphone, Wallet } from 'lucide-react';
import InputError from '@/components/input-error';
import type {
    CheckoutFormData,
    PaymentMethod,
    PaymentProvider,
} from '@/components/storefront/checkout/checkout-form-data';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Props = {
    data: CheckoutFormData;
    errors: Partial<Record<keyof CheckoutFormData | 'cart', string>>;
    setData: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void;
};

const inputClass =
    'font-poppins w-full rounded-[20px] border border-[#6b7280] bg-white px-6 py-2.5 text-sm text-black placeholder:text-[#6b7280] focus-visible:border-black focus-visible:ring-black/10';

const PAYMENT_OPTIONS: {
    provider: PaymentProvider;
    method: PaymentMethod;
    title: string;
    description: string;
}[] = [
    {
        provider: 'airtel',
        method: 'mobile_money',
        title: 'Airtel Money',
        description: 'Paiement sécurisé via Airtel Money',
    },
    {
        provider: 'orange',
        method: 'mobile_money',
        title: 'Orange Money',
        description: 'Paiement sécurisé via Orange Money',
    },
    {
        provider: 'mpesa',
        method: 'mobile_money',
        title: 'M-Pesa',
        description: 'Paiement sécurisé via M-Pesa',
    },
    {
        provider: 'card',
        method: 'mobile_money',
        title: 'Carte bancaire',
        description: 'Visa, Mastercard et autres cartes',
    },
    {
        provider: null,
        method: 'cash_on_delivery',
        title: 'Paiement à la livraison',
        description: 'Payez en espèce à la réception de votre commande',
    },
];

export function CheckoutPaymentStep({ data, errors, setData }: Props) {
    function selectPayment(method: PaymentMethod, provider: PaymentProvider) {
        setData('payment_method', method);
        setData('payment_provider', provider);
    }

    const selectedKey = `${data.payment_method}:${data.payment_provider ?? 'cod'}`;

    return (
        <div className="space-y-10">
            <section>
                <div className="mb-5 flex items-center gap-3">
                    <Wallet className="size-6 text-black" strokeWidth={1.25} />
                    <h2 className="font-poppins text-xl font-medium text-black">Mode de paiement</h2>
                </div>

                <InputError message={errors.payment_method} />

                <div className="flex flex-col gap-3">
                    {PAYMENT_OPTIONS.map((option) => {
                        const key = `${option.method}:${option.provider ?? 'cod'}`;
                        const selected = selectedKey === key;
                        const Icon =
                            option.method === 'cash_on_delivery'
                                ? Wallet
                                : option.provider === 'card'
                                  ? CreditCard
                                  : Smartphone;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => selectPayment(option.method, option.provider)}
                                className={cn(
                                    'flex w-full items-center gap-4 rounded-[20px] border px-5 py-4 text-left transition-colors',
                                    selected ? 'border-[#0059DD]' : 'border-[#8a8a8a]',
                                )}
                            >
                                <span
                                    className={cn(
                                        'size-2 shrink-0 rounded-full border',
                                        selected
                                            ? 'border-[#0059DD] bg-[#0059DD]'
                                            : 'border-[#8a8a8a] bg-transparent',
                                    )}
                                    aria-hidden
                                />
                                <Icon className="size-8 shrink-0 text-black" strokeWidth={1.25} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-black">{option.title}</p>
                                    <p className="mt-1 text-sm text-[rgba(91,94,100,0.62)]">
                                        {option.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-center gap-3">
                    <Brush className="size-6 text-black" strokeWidth={1.25} />
                    <h2 className="font-poppins text-base font-medium text-black">Note (optionnel)</h2>
                </div>
                <Label htmlFor="customer_note" className="sr-only">
                    Note
                </Label>
                <Textarea
                    id="customer_note"
                    value={data.customer_note}
                    onChange={(e) => setData('customer_note', e.target.value)}
                    placeholder="Ajouter une note pour votre commande"
                    rows={4}
                    className={cn(inputClass, 'min-h-[100px] resize-none')}
                />
                <InputError message={errors.customer_note} />
            </section>

            <InputError message={errors.cart} />
        </div>
    );
}
