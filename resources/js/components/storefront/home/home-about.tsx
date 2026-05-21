import { Gem, Ruler, Sprout } from 'lucide-react';
import { HOME_ASSETS } from '@/lib/home-assets';

const FEATURES = [
    { icon: Gem, label: 'Matières nobles' },
    { icon: Ruler, label: 'Coupe architecturale' },
    { icon: Sprout, label: 'Éthique & Durable' },
] as const;

export function HomeAbout() {
    return (
        <section id="pourquoi-nous" className="bg-white px-4 py-16 sm:px-8 lg:px-[100px] lg:py-[100px]">
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
                <div className="flex w-full max-w-[578px] flex-col justify-center gap-7 py-2 lg:py-5">
                    <div>
                        <h2 className="font-poppins text-[clamp(2.5rem,6vw,5.25rem)] font-extrabold leading-tight text-black">
                            Pourquoi
                            <br />
                            Nous ?
                        </h2>
                        <p className="mt-1 max-w-xl font-poppins text-xl text-[#393939]">
                            Chez PCJ, la mode est une expression personnelle. Nos collections
                            uniques de vêtements et d&apos;accessoires sont conçus pour affirmer
                            votre style. Nous privilégions la durabilité et l&apos;éthique, en
                            utilisant des matériaux respectueux de l&apos;environnement. Faites un
                            choix de mode responsable et élégant avec PCJ.
                        </p>
                    </div>

                    <div className="grid w-full max-w-[578px] grid-cols-3 gap-2 overflow-hidden sm:gap-0 sm:pr-5">
                        {FEATURES.map(({ icon: Icon, label }, index) => (
                            <div
                                key={label}
                                className={`flex flex-col items-center gap-2 px-1 py-4 text-center sm:gap-2.5 sm:px-2.5 sm:py-6 sm:pt-11 sm:pb-2.5 ${
                                    index === 1 ? 'border-x border-black' : ''
                                }`}
                            >
                                <Icon className="size-9 text-black sm:size-[54px]" strokeWidth={1.25} />
                                <p className="font-poppins text-xs font-medium text-black sm:text-xl">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-[min(367px,55vh)] w-full max-w-[600px] overflow-hidden rounded-[20px] lg:h-[min(720px,70vh)] lg:rounded-br-[20px] lg:rounded-tr-[20px] lg:shrink-0">
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
