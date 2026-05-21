import { HOME_ASSETS } from '@/lib/home-assets';

export function CollectionHero() {
    return (
        <section className="px-4 sm:px-8 lg:px-[62px]">
            <div className="flex min-h-0 flex-col overflow-hidden rounded-sm lg:min-h-[min(575px,70vh)] lg:flex-row lg:items-stretch">
                <div className="relative flex min-h-[min(451px,55vh)] flex-1 items-end justify-center bg-[#c07f12] lg:max-w-[45%] lg:min-h-[280px]">
                    <img
                        src={HOME_ASSETS.collectionHero}
                        alt=""
                        className="h-full max-h-[min(451px,55vh)] w-auto max-w-full object-contain object-bottom lg:max-h-[575px]"
                    />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3 bg-[#292d32] px-4 py-8 sm:gap-4 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                    <h1 className="font-poppins text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-tight tracking-tight text-white">
                        GARDONS NOTRE ATTITUDE
                    </h1>
                    <p className="max-w-xl font-poppins text-lg text-white/95 md:text-xl">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                        vulputate libero et velit interdum, ac aliquet.
                    </p>
                </div>
            </div>
        </section>
    );
}
