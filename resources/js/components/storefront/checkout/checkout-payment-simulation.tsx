import { useEffect, useState } from 'react';
import type { PaymentProvider } from '@/components/storefront/checkout/checkout-form-data';
import { PhoneInput } from '@/components/ui/phone-input';
import { Button } from '@/components/ui/button';
import { CHECKOUT_PAYMENT_ASSETS } from '@/lib/home-assets';
import { isValidMobileMoneyPhone, mobileMoneyPhoneError, mobileMoneyPhoneHint, mobileMoneyPhonePlaceholder } from '@/lib/phone';
import { cn } from '@/lib/utils';

function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function formatCardExpiry(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
        return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isCardFormValid(cardNumber: string, cardExpiry: string, cardCvv: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 16) {
        return false;
    }

    const [month, year] = cardExpiry.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
        return false;
    }

    const monthNum = Number(month);
    if (monthNum < 1 || monthNum > 12) {
        return false;
    }

    return cardCvv.replace(/\D/g, '').length === 3;
}

const inputClassName =
    'font-poppins w-full rounded-[12px] border border-black/10 bg-white px-4 py-3 text-sm text-black placeholder:text-[#9ca3af] focus:border-[#0059DD] focus:outline-none focus:ring-2 focus:ring-[#0059DD]/20';

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

const PROVIDER_PHONE_LABEL: Record<'airtel' | 'orange' | 'mpesa', string> = {
    airtel: 'Numéro Airtel Money',
    orange: 'Numéro Orange Money',
    mpesa: 'Numéro M-Pesa',
};

type Props = {
    provider: Exclude<PaymentProvider, null>;
    amount: number;
    phone: string;
    whatsappPhone?: string;
    onConfirm: (phone: string) => void;
    onCancel: () => void;
};

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)} $`;
}

export function CheckoutPaymentSimulation({
    provider,
    amount,
    phone,
    whatsappPhone = '',
    onConfirm,
    onCancel,
}: Props) {
    const meta = PROVIDER_META[provider];
    const [pin, setPin] = useState('');
    const [mobilePhone, setMobilePhone] = useState(phone);
    const [mobileError, setMobileError] = useState<string | null>(null);
    const [pinError, setPinError] = useState<string | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardError, setCardError] = useState<string | null>(null);
    const [step, setStep] = useState<'redirect' | 'confirm'>('redirect');

    const isCard = provider === 'card';
    const isMobileMoney = provider === 'airtel' || provider === 'orange' || provider === 'mpesa';
    const cardValid = isCardFormValid(cardNumber, cardExpiry, cardCvv);
    const mobileValid =
        isMobileMoney && (provider === 'airtel' || provider === 'orange' || provider === 'mpesa')
            ? isValidMobileMoneyPhone(mobilePhone, provider)
            : false;
    const pinValid = pin.length === 4;

    useEffect(() => {
        setMobilePhone(phone);
        setMobileError(null);
        setPinError(null);
        setStep('redirect');
        setPin('');
    }, [provider, phone]);

    function handleConfirm() {
        if (isCard && !cardValid) {
            setCardError('Renseignez un numéro de carte, une date d’expiration (MM/AA) et un CVV valides.');
            return;
        }
        if (isMobileMoney && !mobileValid) {
            setMobileError(
                provider === 'airtel' || provider === 'orange' || provider === 'mpesa'
                    ? mobileMoneyPhoneError(provider)
                    : 'Indiquez un numéro Mobile Money valide.',
            );
            return;
        }
        if (!isCard && !pinValid) {
            setPinError('Indiquez votre code PIN à 4 chiffres pour confirmer le paiement.');
            return;
        }
        setCardError(null);
        setMobileError(null);
        setPinError(null);
        onConfirm(isMobileMoney ? mobilePhone : phone);
    }

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
                        {isCard
                            ? 'Vous allez saisir les informations de votre carte sur une page sécurisée.'
                            : 'Vous allez être redirigé vers la page de paiement sécurisée de votre opérateur.'}
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
                    <div className="space-y-1.5">
                        <p className="font-poppins text-sm font-medium text-black">Montant à payer</p>
                        <p className="font-poppins text-3xl font-bold text-black">{formatMoney(amount)}</p>
                    </div>

                    {!isCard ? (
                        <div className="space-y-2">
                            <label
                                htmlFor="payment-mobile-phone"
                                className="font-poppins text-sm font-medium text-black"
                            >
                                {isMobileMoney
                                    ? PROVIDER_PHONE_LABEL[provider]
                                    : 'Numéro de compte'}
                            </label>
                            <PhoneInput
                                id="payment-mobile-phone"
                                name="payment_phone"
                                value={mobilePhone}
                                onChange={(value) => {
                                    setMobileError(null);
                                    setMobilePhone(value);
                                }}
                                variant="rounded"
                                hasError={!!mobileError}
                                placeholder={
                                    isMobileMoney &&
                                    (provider === 'airtel' ||
                                        provider === 'orange' ||
                                        provider === 'mpesa')
                                        ? mobileMoneyPhonePlaceholder(provider)
                                        : '99 123 4567'
                                }
                            />
                            {whatsappPhone && whatsappPhone !== mobilePhone ? (
                                <button
                                    type="button"
                                    className="font-poppins text-xs font-medium text-[#0059DD] hover:underline"
                                    onClick={() => {
                                        setMobileError(null);
                                        setMobilePhone(whatsappPhone);
                                    }}
                                >
                                    Utiliser mon numéro WhatsApp
                                </button>
                            ) : null}
                            {mobileError ? (
                                <p className="font-poppins text-sm text-red-600">{mobileError}</p>
                            ) : (
                                <p className="font-poppins text-xs text-[#6b7280]">
                                    {isMobileMoney &&
                                    (provider === 'airtel' ||
                                        provider === 'orange' ||
                                        provider === 'mpesa')
                                        ? mobileMoneyPhoneHint(provider)
                                        : 'Saisissez le numéro enregistré sur ce réseau Mobile Money.'}
                                </p>
                            )}
                        </div>
                    ) : null}

                    {!isCard ? (
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
                                onChange={(e) => {
                                    setPinError(null);
                                    setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                                }}
                                placeholder="••••"
                                className={cn(
                                    'font-poppins w-full rounded-[12px] border bg-white px-4 py-3 text-center text-lg tracking-[0.4em] text-black',
                                    pinError ? 'border-red-500' : 'border-black/10',
                                )}
                            />
                            {pinError ? (
                                <p className="font-poppins text-sm text-red-600">{pinError}</p>
                            ) : (
                                <p className="font-poppins text-xs text-[#6b7280]">
                                    Validez la transaction sur votre téléphone, puis confirmez ci-dessous.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label
                                    htmlFor="payment-card-number"
                                    className="font-poppins text-sm font-medium text-black"
                                >
                                    Numéro de carte
                                </label>
                                <input
                                    id="payment-card-number"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        setCardError(null);
                                        setCardNumber(formatCardNumber(e.target.value));
                                    }}
                                    placeholder="1234 5678 9012 3456"
                                    className={inputClassName}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="payment-card-expiry"
                                        className="font-poppins text-sm font-medium text-black"
                                    >
                                        Date d&apos;expiration
                                    </label>
                                    <input
                                        id="payment-card-expiry"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="cc-exp"
                                        value={cardExpiry}
                                        onChange={(e) => {
                                            setCardError(null);
                                            setCardExpiry(formatCardExpiry(e.target.value));
                                        }}
                                        placeholder="MM/AA"
                                        className={inputClassName}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="payment-card-cvv"
                                        className="font-poppins text-sm font-medium text-black"
                                    >
                                        CVV
                                    </label>
                                    <input
                                        id="payment-card-cvv"
                                        type="password"
                                        inputMode="numeric"
                                        autoComplete="cc-csc"
                                        maxLength={3}
                                        value={cardCvv}
                                        onChange={(e) => {
                                            setCardError(null);
                                            setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
                                        }}
                                        placeholder="123"
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <p className="font-poppins text-xs text-[#6b7280]">
                                Simulation locale — aucune donnée bancaire n&apos;est enregistrée ni transmise.
                            </p>

                            {cardError ? (
                                <p className="font-poppins text-sm text-red-600">{cardError}</p>
                            ) : null}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            type="button"
                            className={cn(
                                'font-poppins h-auto w-full rounded-full py-3 text-base font-semibold text-white',
                            )}
                            style={{ backgroundColor: meta.accent }}
                            onClick={handleConfirm}
                            disabled={
                                (isCard && !cardValid) ||
                                (isMobileMoney && (!mobileValid || !pinValid))
                            }
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
