import { MapPin, Store, Truck } from 'lucide-react';
import InputError from '@/components/input-error';
import type { CheckoutFormData } from '@/components/storefront/checkout/checkout-form-data';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Props = {
    data: CheckoutFormData;
    errors: Partial<Record<keyof CheckoutFormData | 'cart', string>>;
    setData: <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => void;
};

const inputClass =
    'font-poppins w-full rounded-[20px] border border-[#6b7280] bg-white px-6 py-2.5 text-sm text-black placeholder:text-[#6b7280] focus-visible:border-black focus-visible:ring-black/10';

const labelClass = 'font-poppins text-sm font-medium text-black';

export function CheckoutShippingStep({ data, errors, setData }: Props) {
    const isPickup = data.delivery_method === 'store_pickup';

    return (
        <div className="space-y-10">
            <section>
                <div className="mb-6 flex items-center gap-3">
                    <Truck className="size-8 text-black" strokeWidth={1.25} />
                    <h2 className="font-poppins text-xl font-medium text-black">
                        Mode de livraison
                    </h2>
                </div>

                <InputError message={errors.delivery_method} />

                <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
                    <DeliveryOption
                        selected={data.delivery_method === 'home_delivery'}
                        onSelect={() => setData('delivery_method', 'home_delivery')}
                        title="Livraison à domicile"
                        description="Recevez votre commande à l'adresse indiquée"
                        icon={<Truck className="size-8 text-black" strokeWidth={1.25} />}
                    />
                    <DeliveryOption
                        selected={data.delivery_method === 'store_pickup'}
                        onSelect={() => setData('delivery_method', 'store_pickup')}
                        title="Retrait en boutique"
                        description="Récupérez votre commande directement en magasin"
                        icon={<Store className="size-8 text-black" strokeWidth={1.25} />}
                    />
                </div>
            </section>

            <section>
                <div className="mb-6 flex items-center gap-3">
                    <MapPin className="size-8 text-black" strokeWidth={1.25} />
                    <h2 className="font-poppins text-xl font-medium text-black">
                        {isPickup ? 'Coordonnées' : 'Adresse de livraison'}
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

                    {!isPickup ? (
                        <>
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
                                        onChange={(e) =>
                                            setData('shipping_district', e.target.value)
                                        }
                                        placeholder="Entrez votre quartier"
                                        className={inputClass}
                                        required
                                    />
                                    <InputError message={errors.shipping_district} />
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </section>
        </div>
    );
}

function DeliveryOption({
    selected,
    onSelect,
    title,
    description,
    icon,
}: {
    selected: boolean;
    onSelect: () => void;
    title: string;
    description: string;
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
