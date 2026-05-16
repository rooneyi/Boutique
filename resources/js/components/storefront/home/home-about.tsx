import { Gem, Ruler, Sprout } from 'lucide-react';
import { HOME_ASSETS } from '@/lib/home-assets';

const FEATURES = [
    { icon: Gem, label: 'Matières nobles' },
    { icon: Ruler, label: 'Coupe architecturale' },
    { icon: Sprout, label: 'Éthique & Durable' },
] as const;

export function HomeAbout() {
    return (
        <section id="pourquoi-nous" className="bg-white py-16 md:py-24">
            <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-[100px]">
                <div className="flex flex-col justify-center gap-7">
                    <div>
                        <h2 className="font-poppins text-[clamp(2.5rem,6vw,5.25rem)] font-extrabold leading-tight text-black">
                            Pourquoi
                            <br />
                            Nous ?
                        </h2>
                        <p className="mt-4 max-w-xl font-poppins text-lg text-[#393939] md:text-xl">
                            Chez PCJ, la mode est une expression personnelle. Nos collections
                            uniques de vêtements et d&apos;accessoires sont conçus pour affirmer
                            votre style. Nous privilégions la durabilité et l&apos;éthique, en
                            utilisant des matériaux respectueux de l&apos;environnement. Faites un
                            choix de mode responsable et élégant avec PCJ.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-t border-black/10 pt-6">
                        {FEATURES.map(({ icon: Icon, label }, index) => (
                            <div
                                key={label}
                                className={`flex flex-col items-center gap-2.5 px-2 text-center ${
                                    index === 1 ? 'border-x border-black' : ''
                                }`}
                            >
                                <Icon className="size-12 text-black" strokeWidth={1.25} />
                                <p className="font-poppins text-base font-medium text-black md:text-xl">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-hidden rounded-r-[20px] lg:h-[720px]">
                    <img
                        src={HOME_ASSETS.aboutModels}
                        alt="Modèles PCJ"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}
