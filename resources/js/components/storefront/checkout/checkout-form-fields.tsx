import { Brush, Smartphone, Truck, Wallet } from 'lucide-react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type CheckoutFormData = {
    shipping_full_name: string;
    shipping_whatsapp: string;
    shipping_address: string;
    shipping_city: string;
    shipping_district: string;
    payment_method: 'mobile_money' | 'cash_on_delivery';
    customer_note: string;
};

type Props = {
    data: CheckoutFormData;
    errors: Partial<Record<keyof CheckoutFormData | 'cart', string>>;
    setData: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void;
};

const inputClass =
    'font-poppins w-full rounded-[20px] border border-[#6b7280] bg-white px-6 py-2.5 text-sm text-black placeholder:text-[#6b7280] focus-visible:border-black focus-visible:ring-black/10';

const labelClass = 'font-poppins text-sm font-medium text-black';

export function CheckoutFormFields({ data, errors, setData }: Props) {
    return (
        <div className="space-y-10">
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <Truck className="size-8 text-black" strokeWidth={1.25} />
                    <h2 className="font-poppins text-xl font-medium text-black">
                        Informations de livraison
                    </h2>
                </div>

                <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-3">
                            <Label htmlFor="shipping_full_name" className={labelClass}>
                                Nom complet
                            </Label>
                            <input
                                id="shipping_full_name"
                                type="text"
                                value={data.shipping_full_name}
                                onChange={(e) => setData('shipping_full_name', e.target.value)}
                                placeholder="Entrez votre nom complet"
                                className={inputClass}
                                required
                            />
                            <InputError message={errors.shipping_full_name} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="shipping_whatsapp" className={labelClass}>
                                Numéro Whatsapp
                            </Label>
                            <input
                                id="shipping_whatsapp"
                                type="tel"
                                value={data.shipping_whatsapp}
                                onChange={(e) => setData('shipping_whatsapp', e.target.value)}
                                placeholder="Ex: +225 07 XX XX XX"
                                className={inputClass}
                                required
                            />
                            <InputError message={errors.shipping_whatsapp} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="shipping_address" className={labelClass}>
                            Adresse complète
                        </Label>
                        <input
                            id="shipping_address"
                            type="text"
                            value={data.shipping_address}
                            onChange={(e) => setData('shipping_address', e.target.value)}
                            placeholder="Entrez votre adresse complète"
                            className={inputClass}
                            required
                        />
                        <InputError message={errors.shipping_address} />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-3">
                            <Label htmlFor="shipping_city" className={labelClass}>
                                Ville / Commune
                            </Label>
                            <input
                                id="shipping_city"
                                type="text"
                                value={data.shipping_city}
                                onChange={(e) => setData('shipping_city', e.target.value)}
                                placeholder="Entrez votre ville"
                                className={inputClass}
                                required
                            />
                            <InputError message={errors.shipping_city} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="shipping_district" className={labelClass}>
                                Quartier
                            </Label>
                            <input
                                id="shipping_district"
                                type="text"
                                value={data.shipping_district}
                                onChange={(e) => setData('shipping_district', e.target.value)}
                                placeholder="Entrez votre quartier"
                                className={inputClass}
                                required
                            />
                            <InputError message={errors.shipping_district} />
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-5 flex items-center gap-3">
                    <Wallet className="size-6 text-black" strokeWidth={1.25} />
                    <h2 className="font-poppins text-xl font-medium text-black">Mode de paiement</h2>
                </div>

                <InputError message={errors.payment_method} />

                <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                    <PaymentOption
                        selected={data.payment_method === 'mobile_money'}
                        onSelect={() => setData('payment_method', 'mobile_money')}
                        title="Mobile Money"
                        description={
                            <>
                                Payez facilement avec
                                <br />
                                Mobile Money (Airtel Money, M-Pesa...)
                            </>
                        }
                        icon={<Smartphone className="size-8 text-black" strokeWidth={1.25} />}
                    />
                    <PaymentOption
                        selected={data.payment_method === 'cash_on_delivery'}
                        onSelect={() => setData('payment_method', 'cash_on_delivery')}
                        title="Paiement à livraison"
                        description={
                            <>
                                Payez en espèce à la réception
                                <br />
                                de votre commande
                            </>
                        }
                        icon={<Wallet className="size-6 text-black" strokeWidth={1.25} />}
                    />
                </div>
            </section>

            <section>
                <div className="mb-4 flex items-center gap-3">
                    <Brush className="size-6 text-black" strokeWidth={1.25} />
                    <h2 className="font-poppins text-base font-medium text-black">Note (optionnel)</h2>
                </div>
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

function PaymentOption({
    selected,
    onSelect,
    title,
    description,
    icon,
}: {
    selected: boolean;
    onSelect: () => void;
    title: string;
    description: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                'flex max-w-full flex-1 items-start gap-3 rounded-[20px] border p-4 text-left transition-colors',
                selected ? 'border-[#0059DD]' : 'border-[#8a8a8a]',
            )}
        >
            <span
                className={cn(
                    'mt-1 size-2 shrink-0 rounded-full border',
                    selected ? 'border-[#0059DD] bg-[#0059DD]' : 'border-[#8a8a8a] bg-transparent',
                )}
                aria-hidden
            />
            <div className="flex gap-5">
                {icon}
                <div>
                    <p className="text-sm font-medium text-black">{title}</p>
                    <p className="mt-2 text-sm leading-snug text-[rgba(91,94,100,0.62)]">
                        {description}
                    </p>
                </div>
            </div>
        </button>
    );
}
