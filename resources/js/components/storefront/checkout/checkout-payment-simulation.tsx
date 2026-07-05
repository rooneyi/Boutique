import { useState } from 'react';
import type { PaymentProvider } from '@/components/storefront/checkout/checkout-form-data';
import { Button } from '@/components/ui/button';
import { CHECKOUT_PAYMENT_ASSETS } from '@/lib/home-assets';
import { cn } from '@/lib/utils';

const PROVIDER_META: Record<
    Exclude<PaymentProvider, null>,
    { label: string; image: string; accent: string; bg: string }
> = {
    airtel: {
        label: 'Airtel Money',
        image: CHECKOUT_PAYMENT_ASSETS.airtel,
        accent: '#ED1C24',
        bg: '#FFF5F5',
    },
    orange: {
        label: 'Orange Money',
        image: CHECKOUT_PAYMENT_ASSETS.orange,
        accent: '#FF7900',
        bg: '#FFF8F0',
    },
    mpesa: {
        label: 'M-Pesa',
        image: CHECKOUT_PAYMENT_ASSETS.mpesa,
        accent: '#4CAF50',
        bg: '#F3FBF3',
    },
    card: {
        label: 'Carte bancaire',
        image: CHECKOUT_PAYMENT_ASSETS.card,
        accent: '#0059DD',
        bg: '#F5F8FF',
    },
};

type Props = {
    provider: Exclude<PaymentProvider, null>;
    amount: number;
    phone: string;
    onConfirm: () => void;
    onCancel: () => void;
};

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)} $`;
}

export function CheckoutPaymentSimulation({ provider, amount, phone, onConfirm, onCancel }: Props) {
    const meta = PROVIDER_META[provider];
    const [pin, setPin] = useState('');
    const [step, setStep] = useState<'redirect' | 'confirm'>('redirect');

    if (step === 'redirect') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
                <div
                    className="flex w-full max-w-md flex-col items-center gap-6 rounded-[24px] bg-white px-8 py-10 text-center shadow-xl"
                    style={{ borderTop: `4px solid ${meta.accent}` }}
                >
                    <img src={meta.image} alt="" className="size-20 rounded-full object-cover" />
                    <div className="space-y-2">
                        <p className="font-poppins text-sm text-[#6b7280]">Redirection vers</p>
                        <h2 className="font-poppins text-2xl font-semibold text-black">{meta.label}</h2>
                    </div>
                    <p className="font-poppins text-sm text-[#484848]">
                        Vous allez être redirigé vers la page de paiement sécurisée de votre opérateur.
                    </p>
                    <div className="flex w-full flex-col gap-3">
                        <Button
                            type="button"
                            className="font-poppins h-auto w-full rounded-full py-3 text-base font-semibold text-white"
                            style={{ backgroundColor: meta.accent }}
                            onClick={() => setStep('confirm')}
                        >
                            Continuer vers {meta.label}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="font-poppins h-auto w-full rounded-full py-3 text-base"
                            onClick={onCancel}
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
            <div
                className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-xl"
                style={{ backgroundColor: meta.bg }}
            >
                <div className="px-6 py-5 text-white" style={{ backgroundColor: meta.accent }}>
                    <div className="flex items-center gap-3">
                        <img
                            src={meta.image}
                            alt=""
                            className="size-12 rounded-full border-2 border-white/30 bg-white object-cover"
                        />
                        <div>
                            <p className="font-poppins text-xs uppercase tracking-wide opacity-90">
                                Paiement sécurisé
                            </p>
                            <h2 className="font-poppins text-xl font-semibold">{meta.label}</h2>
                        </div>
                    </div>
                </div>

                <div className="space-y-5 px-6 py-6">
                    <div className="rounded-[16px] border border-black/10 bg-white p-4">
                        <p className="font-poppins text-sm text-[#6b7280]">Montant à payer</p>
                        <p className="font-poppins text-3xl font-bold text-black">{formatMoney(amount)}</p>
                    </div>

                    <div className="space-y-1.5">
                        <p className="font-poppins text-sm font-medium text-black">Numéro de compte</p>
                        <p className="font-poppins rounded-[12px] border border-black/10 bg-white px-4 py-3 text-sm text-black">
                            {phone || '—'}
                        </p>
                    </div>

                    {provider !== 'card' ? (
                        <div className="space-y-1.5">
                            <label
                                htmlFor="payment-sim-pin"
                                className="font-poppins text-sm font-medium text-black"
                            >
                                Code PIN (simulation)
                            </label>
                            <input
                                id="payment-sim-pin"
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="••••"
                                className="font-poppins w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 text-center text-lg tracking-[0.4em] text-black"
                            />
                            <p className="font-poppins text-xs text-[#6b7280]">
                                Validez la transaction sur votre téléphone, puis confirmez ci-dessous.
                            </p>
                        </div>
                    ) : (
                        <p className="font-poppins text-sm text-[#484848]">
                            Saisissez vos coordonnées bancaires sur la page sécurisée, puis confirmez le
                            paiement.
                        </p>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            type="button"
                            className={cn(
                                'font-poppins h-auto w-full rounded-full py-3 text-base font-semibold text-white',
                            )}
                            style={{ backgroundColor: meta.accent }}
                            onClick={onConfirm}
                        >
                            J&apos;ai confirmé le paiement
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="font-poppins h-auto w-full rounded-full border-black/20 bg-white py-3 text-base"
                            onClick={onCancel}
                        >
                            Annuler
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
