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
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
                <div className="flex max-w-[578px] flex-col justify-center gap-7 py-5">
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

                    <div className="grid w-full max-w-[578px] grid-cols-1 gap-4 overflow-hidden sm:grid-cols-3 sm:gap-0 sm:pr-5">
                        {FEATURES.map(({ icon: Icon, label }, index) => (
                            <div
                                key={label}
                                className={`flex flex-col items-center gap-2.5 px-2.5 py-6 text-center sm:pt-11 sm:pb-2.5 ${
                                    index === 1 ? 'sm:border-x sm:border-black' : ''
                                }`}
                            >
                                <Icon className="size-[54px] text-black" strokeWidth={1.25} />
                                <p className="font-poppins text-xl font-medium text-black">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-[min(720px,70vh)] w-full max-w-[600px] overflow-hidden rounded-br-[20px] rounded-tr-[20px] lg:shrink-0">
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
