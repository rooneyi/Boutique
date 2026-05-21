import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_HERO_CTA } from '@/lib/storefront-ui-styles';

export function HomeHero() {
    return (
        <section className="relative flex min-h-[min(623px,92dvh)] flex-col overflow-hidden bg-gradient-to-b from-[#303030] via-[#4a4a4a] via-[50%] to-[#1d1d1d] lg:min-h-[min(929px,100dvh)]">
            <p className="relative z-30 shrink-0 px-4 pt-10 text-center font-poppins text-xl font-extrabold text-white sm:pt-14 sm:text-2xl lg:text-[36px] lg:leading-[65px]">
                Gardons notre attitude
            </p>

            <div className="relative z-10 flex min-h-[min(480px,58vh)] w-full flex-1 items-center justify-center px-4 py-6 lg:min-h-[min(680px,72vh)]">
                <p
                    className="pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 select-none text-center font-poppins text-[clamp(3.5rem,16vw,10rem)] font-black leading-none tracking-[0.05em] text-[#676767] lg:top-[12%]"
                    aria-hidden
                >
                    POSE
                </p>
                <p
                    className="pointer-events-none absolute left-1/2 top-[min(22%,28vw)] -translate-x-1/2 select-none text-center font-poppins text-[clamp(3.5rem,16vw,10rem)] font-black leading-none tracking-[0.05em] text-[#606060]"
                    aria-hidden
                >
                    COMME
                </p>
                <p
                    className="pointer-events-none absolute left-1/2 top-[min(36%,48vw)] -translate-x-1/2 select-none text-center font-poppins text-[clamp(3.5rem,16vw,10rem)] font-black leading-none tracking-[0.05em] text-[#5c5c5c] lg:top-[38%]"
                    aria-hidden
                >
                    JAMAIS
                </p>

                <img
                    src={HOME_ASSETS.heroModel}
                    alt="Modèle PCJ"
                    width={591}
                    height={760}
                    className="relative z-20 mx-auto h-auto w-full max-w-[330px] object-contain object-bottom sm:max-w-[440px] lg:max-w-[591px] lg:max-h-[min(760px,70vh)]"
                />
            </div>

            <div className="relative z-30 flex shrink-0 justify-center px-4 pb-10 pt-2 sm:pb-14 lg:pb-20">
                <Link
                    href={route('customer.products.index')}
                    className={`${SF_HERO_CTA} w-full max-w-md text-center sm:w-auto`}
                >
                    DECOUVRIR NOTRE COLLECTION
                </Link>
            </div>
        </section>
    );
}
