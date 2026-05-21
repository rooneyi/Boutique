import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_HERO_CTA } from '@/lib/storefront-ui-styles';

export function HomeHero() {
    return (
        <section className="relative flex min-h-[min(640px,92dvh)] flex-col items-center justify-end overflow-hidden bg-gradient-to-b from-[#303030] via-[#4a4a4a] via-[50%] to-[#1d1d1d] pb-12 pt-12 sm:min-h-[min(760px,95dvh)] sm:pb-16 sm:pt-16 lg:min-h-[min(929px,100dvh)] lg:pb-20">
            <p className="relative z-10 mb-2 px-4 text-center font-poppins text-2xl font-extrabold leading-tight text-white sm:text-[36px] sm:leading-[65px]">
                Gardons notre attitude
            </p>

            <div className="relative mx-auto w-full max-w-[1103px] flex-1 px-4">
                <p
                    className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 select-none text-center font-poppins text-[clamp(4rem,18vw,16rem)] font-black leading-none tracking-[0.05em] text-[#676767]"
                    aria-hidden
                >
                    POSE
                </p>
                <p
                    className="pointer-events-none absolute left-1/2 top-[min(11rem,28vw)] -translate-x-1/2 select-none text-center font-poppins text-[clamp(4rem,18vw,16rem)] font-black leading-none tracking-[0.05em] text-[#606060]"
                    aria-hidden
                >
                    COMME
                </p>
                <p
                    className="pointer-events-none absolute left-1/2 top-[min(22rem,52vw)] -translate-x-1/2 select-none text-center font-poppins text-[clamp(4rem,18vw,16rem)] font-black leading-none tracking-[0.05em] text-[#4a4a4a]"
                    aria-hidden
                >
                    JAMAIS
                </p>

                <img
                    src={HOME_ASSETS.heroModel}
                    alt="Modèle PCJ"
                    className="relative z-10 mx-auto mt-[min(3rem,8vh)] h-[min(760px,65vh)] w-auto max-w-[591px] object-contain object-bottom"
                />
            </div>

            <Link
                href={route('customer.products.index')}
                className={`${SF_HERO_CTA} relative z-10 mx-4 mb-2 w-[calc(100%-2rem)] max-w-md text-center sm:mx-0 sm:w-auto`}
            >
                DECOUVRIR NOTRE COLLECTION
            </Link>
        </section>
    );
}
