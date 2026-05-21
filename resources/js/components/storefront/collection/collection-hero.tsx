import { HOME_ASSETS } from '@/lib/home-assets';

export function CollectionHero() {
    return (
        <section className="w-full">
            {/* Mobile / tablette — Figma collection/402 (361:3830) */}
            <div className="flex flex-col items-center justify-end bg-gradient-to-r from-[#c07f12] from-[10%] via-[#c07f12] via-[94%] to-[#915e07] px-4 pb-0 pt-6 lg:hidden">
                <div className="w-full max-w-[370px] space-y-4 text-white">
                    <h1 className="font-poppins text-[36px] font-black uppercase leading-tight tracking-tight">
                        GARDONS NOTRE ATTITUDE
                    </h1>
                    <p className="font-poppins text-[13px] leading-relaxed text-white/95">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                        libero et velit interdum, ac aliquet.
                    </p>
                </div>
                <div className="relative mt-4 h-[min(451px,55vh)] w-full max-w-[300px]">
                    <img
                        src={HOME_ASSETS.collectionHero}
                        alt=""
                        className="mx-auto h-full w-full object-contain object-bottom"
                    />
                </div>
            </div>

            {/* Desktop — bannière split */}
            <div className="mx-auto hidden max-w-[1440px] flex-col overflow-hidden rounded-sm px-4 sm:px-8 lg:flex lg:min-h-[min(575px,70vh)] lg:flex-row lg:items-stretch lg:px-[62px]">
                <div className="relative flex min-h-[280px] flex-1 items-end justify-center bg-[#c07f12] lg:max-w-[45%]">
                    <img
                        src={HOME_ASSETS.collectionHero}
                        alt=""
                        className="h-full max-h-[min(575px,70vh)] w-auto max-w-full object-contain object-bottom"
                    />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3 bg-[#292d32] px-8 py-12 lg:px-12">
                    <h1 className="font-poppins text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-tight tracking-tight text-white">
                        GARDONS NOTRE ATTITUDE
                    </h1>
                    <p className="max-w-xl font-poppins text-lg text-white/95 md:text-xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                        libero et velit interdum, ac aliquet.
                    </p>
                </div>
            </div>
        </section>
    );
}
