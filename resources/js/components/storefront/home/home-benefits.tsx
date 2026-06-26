import { Link } from '@inertiajs/react';
import { ShieldCheck, ShoppingBasket, Truck } from 'lucide-react';
import { route } from '@/lib/route';
import { SF_PILL_BTN_DARK } from '@/lib/storefront-ui-styles';

const BENEFITS = [
    {
        icon: Truck,
        title: 'Livraison gratuite',
        text: 'Profitez de la livraison offerte sur vos commandes éligibles, directement à domicile ou en boutique.',
    },
    {
        icon: ShoppingBasket,
        title: 'Retrait en magasin',
        text: 'Récupérez votre commande en magasin à l\'heure qui vous convient, sans frais supplémentaires.',
    },
    {
        icon: ShieldCheck,
        title: 'Garantie',
        text: 'Chaque article est contrôlé avant expédition. Votre satisfaction est notre priorité.',
    },
] as const;

export function HomeBenefits() {
    return (
        <section className="bg-[#f0f0f0] px-4 py-16 sm:px-8 lg:px-[100px] lg:py-[100px]">
            <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
                <h2 className="text-center font-poppins text-[clamp(2rem,6vw,5.25rem)] font-extrabold leading-normal text-black">
                    Simplifiez Vos
                    <br />
                    Achats Avec PCJ
                </h2>

                <div className="grid w-full gap-10 md:grid-cols-3">
                    {BENEFITS.map(({ icon: Icon, title, text }) => (
                        <div
                            key={title}
                            className="flex flex-col items-center gap-3 px-4 text-center"
                        >
                            <Icon className="size-20 text-black" strokeWidth={1} />
                            <h3 className="font-poppins text-2xl font-semibold text-black md:text-[32px]">
                                {title}
                            </h3>
                            <p className="font-poppins text-lg font-medium leading-[30px] text-[#484848] md:text-xl">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>

                <Link href={route('customer.products.index')} className={SF_PILL_BTN_DARK}>
                    ACHETER MAINTENANT
                </Link>
            </div>
        </section>
    );
}
