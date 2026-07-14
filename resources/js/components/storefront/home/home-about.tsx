import { Gem, Ruler, Sprout } from 'lucide-react';
import { HOME_ASSETS } from '@/lib/home-assets';

const FEATURES = [
    { icon: Gem, label: 'Matières nobles' },
    { icon: Ruler, label: 'Coupe' },
    { icon: Sprout, label: 'Éthique' },
] as const;

export function HomeAbout() {
    return (
        <section className="bg-white px-4 py-16 sm:px-8 lg:p-[100px]">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-center gap-6 lg:flex-row lg:gap-6">
                <div className="flex w-full max-w-[618px] flex-col justify-center gap-7 p-5 lg:h-[720px] lg:gap-7">
                    <div className="flex max-w-[578px] flex-col items-start gap-1">
                        <h2 className="font-poppins text-[clamp(2.75rem,10vw,5.25rem)] font-extrabold leading-normal text-black">
                            <span className="block">Pourquoi</span>
                            <span className="block">nous ?</span>
                        </h2>
                        <p className="w-full max-w-[578px] font-poppins text-lg font-normal leading-[30px] text-[#393939] lg:text-[20px]">
                            Posé Comme Jamais est une marque locale créée à Lubumbashi. Style moderne,
                            authentique et accessible — on met l’accent sur la qualité, le confort et
                            une expérience d’achat simple pour notre communauté.
                        </p>
                    </div>

                    <div className="grid w-full max-w-[578px] grid-cols-3 pr-0 lg:pr-5">
                        {FEATURES.map(({ icon: Icon, label }, index) => (
                            <div
                                key={label}
                                className={`flex flex-col items-center gap-2.5 px-2.5 pt-11 pb-2.5 text-center ${
                                    index === 1 ? 'border-x border-black' : ''
                                }`}
                            >
                                <Icon className="size-[54px] text-black" strokeWidth={1.25} />
                                <p className="font-poppins text-base font-medium leading-normal text-black lg:text-xl">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-[min(367px,55vh)] w-full max-w-[600px] shrink-0 overflow-hidden rounded-[20px] lg:h-[720px] lg:rounded-br-[20px] lg:rounded-tr-[20px]">
                    <img
                        src={HOME_ASSETS.aboutModels}
                        alt="Modèles PCJ"
                        className="size-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
