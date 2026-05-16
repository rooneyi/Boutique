import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_PILL_BTN_LIGHT } from '@/lib/storefront-ui-styles';

export function HomeHero() {
    return (
        <section className="relative flex min-h-[min(100vh,929px)] flex-col items-center justify-end overflow-hidden bg-gradient-to-b from-[#303030] via-[#4a4a4a] via-50% to-[#1d1d1d] pb-16 pt-24">
            <p className="relative z-10 mb-4 font-poppins text-2xl font-extrabold text-white md:text-4xl">
                Gardons notre attitude
            </p>

            <div className="relative flex w-full max-w-5xl flex-col items-center px-4">
                <p
                    className="pointer-events-none select-none text-center font-poppins text-[clamp(3rem,12vw,10rem)] font-black leading-none tracking-[0.05em] text-[#676767]/80"
                    aria-hidden
                >
                    POSE
                </p>
                <p
                    className="pointer-events-none -mt-4 select-none text-center font-poppins text-[clamp(3rem,12vw,10rem)] font-black leading-none tracking-[0.05em] text-[#606060]/80 md:-mt-8"
                    aria-hidden
                >
                    COMME
                </p>
                <p
                    className="pointer-events-none -mt-4 select-none text-center font-poppins text-[clamp(3rem,12vw,10rem)] font-black leading-none tracking-[0.05em] text-[#4a4a4a]/90 md:-mt-8"
                    aria-hidden
                >
                    JAMAIS
                </p>

                <img
                    src={HOME_ASSETS.heroModel}
                    alt="Modèle PCJ"
                    className="relative z-10 -mt-32 w-full max-w-md object-contain md:-mt-48 md:max-w-lg"
                />
            </div>

            <Link
                href={route('customer.products.index')}
                className={`${SF_PILL_BTN_LIGHT} relative z-10 mt-8`}
            >
                DECOUVRIR NOTRE COLLECTION
            </Link>
        </section>
    );
}
