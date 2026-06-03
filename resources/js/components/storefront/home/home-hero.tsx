import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_HERO_CTA } from '@/lib/storefront-ui-styles';

export function HomeHero() {
    return (
        <section className="relative flex h-[min(640px,92dvh)] flex-col items-center justify-end overflow-hidden bg-gradient-to-b from-[#303030] via-[#4a4a4a] via-[50%] to-[#1d1d1d] lg:h-[929px]">
            <p className="relative z-20 mb-4 shrink-0 px-4 text-center font-poppins text-2xl font-extrabold leading-[65px] text-white lg:text-[36px]">
                Gardons notre attitude
            </p>

            <div className="relative z-10 mx-auto h-[min(420px,52vh)] w-full max-w-[1103px] shrink-0 px-4 lg:h-[760px]">
                <span
                    className="pointer-events-none absolute left-[8%] top-0 z-0 hidden select-none font-poppins text-[clamp(3.5rem,16vw,12.5rem)] font-black leading-none tracking-[0.05em] text-[#676767] lg:left-[17.5%] lg:block lg:text-[200px] lg:tracking-[12.8px]"
                    aria-hidden
                >
                    POSE
                </span>
                <span
                    className="pointer-events-none absolute left-[1%] top-[28%] z-0 hidden select-none font-poppins text-[clamp(3.5rem,16vw,12.5rem)] font-black leading-none tracking-[0.05em] text-[#606060] lg:block lg:text-[200px] lg:tracking-[12.8px]"
                    aria-hidden
                >
                    COMME
                </span>
                <span
                    className="pointer-events-none absolute left-0 top-[52%] z-0 hidden select-none font-poppins text-[clamp(3.5rem,16vw,12.5rem)] font-black leading-none tracking-[0.05em] text-[#4a4a4a] lg:block lg:text-[200px] lg:tracking-[12.8px]"
                    aria-hidden
                >
                    JAMAIS
                </span>

                {/* Mobile / tablette : empilement centré */}
                <div className="pointer-events-none absolute inset-x-0 top-[4%] z-0 flex flex-col items-center gap-0 select-none font-poppins text-[clamp(2.75rem,14vw,5rem)] font-black leading-[0.95] tracking-[0.06em] text-[#5c5c5c] lg:hidden">
                    <span className="text-[#676767]">POSE</span>
                    <span className="text-[#606060]">COMME</span>
                    <span className="text-[#4a4a4a]">JAMAIS</span>
                </div>

                <img
                    src={HOME_ASSETS.heroModel}
                    alt="Modèle PCJ"
                    width={591}
                    height={760}
                    className="absolute bottom-0 left-1/2 z-10 h-auto w-[min(100%,591px)] max-w-[330px] -translate-x-1/2 object-contain object-bottom sm:max-w-[440px] lg:max-w-[591px]"
                />
            </div>

            <Link
                href={route('customer.products.index')}
                className={`${SF_HERO_CTA} absolute bottom-8 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 text-center sm:bottom-10 lg:bottom-12 lg:w-auto`}
            >
                DECOUVRIR NOTRE COLLECTION
            </Link>
        </section>
    );
}
