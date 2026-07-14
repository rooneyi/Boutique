import { Gem, Ruler, Sprout } from 'lucide-react';
import { HOME_ASSETS } from '@/lib/home-assets';

const FEATURES = [
    {
        icon: Gem,
        label: 'Matières nobles',
        text: 'Nous sélectionnons avec soin les matières utilisées afin d’offrir des vêtements confortables, résistants et agréables à porter.',
    },
    {
        icon: Ruler,
        label: 'Coupe',
        text: 'Nos collections sont conçues avec des coupes modernes qui allient style, confort et liberté de mouvement.',
    },
    {
        icon: Sprout,
        label: 'Éthique',
        text: 'Nous privilégions une relation de confiance avec nos clients en proposant des produits de qualité, un service fiable et une expérience d’achat transparente.',
    },
] as const;

export function HomeAbout() {
    return (
        <section className="bg-white px-4 py-16 sm:px-8 lg:p-[100px]">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-center gap-6 lg:flex-row lg:gap-6">
                <div className="flex w-full max-w-[618px] flex-col justify-center gap-7 p-5 lg:h-[720px] lg:gap-7">
                    <div className="flex max-w-[578px] flex-col items-start gap-4">
                        <h2 className="font-poppins text-[clamp(2.75rem,10vw,5.25rem)] font-extrabold leading-normal text-black">
                            <span className="block">Pourquoi</span>
                            <span className="block">nous ?</span>
                        </h2>
                        <div className="flex w-full max-w-[578px] flex-col gap-4 font-poppins text-lg font-normal leading-[30px] text-[#393939] lg:text-[20px]">
                            <p>
                                Posé Comme Jamais est une marque locale de vêtements créée à
                                Lubumbashi avec l’ambition de proposer un style moderne, authentique
                                et accessible. Plus qu’une marque de mode, elle reflète un état
                                d’esprit qui encourage chacun à affirmer sa personnalité à travers
                                son style.
                            </p>
                            <p>
                                À travers nos collections, nous mettons l’accent sur la qualité, le
                                confort et le soin apporté aux détails afin d’offrir des produits
                                répondant aux attentes de notre communauté. Notre objectif est de
                                proposer une expérience d’achat simple, fluide et agréable grâce à
                                une plateforme qui facilite l’accès à nos produits et accompagne nos
                                clients tout au long de leur parcours d’achat.
                            </p>
                        </div>
                    </div>

                    <div className="grid w-full max-w-[578px] grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
                        {FEATURES.map(({ icon: Icon, label, text }, index) => (
                            <div
                                key={label}
                                className={`flex flex-col items-center gap-2.5 px-2.5 pt-6 pb-2.5 text-center sm:pt-11 ${
                                    index === 1 ? 'sm:border-x sm:border-black' : ''
                                }`}
                            >
                                <Icon className="size-[54px] shrink-0 text-black" strokeWidth={1.25} />
                                <p className="font-poppins text-base font-medium leading-normal text-black lg:text-xl">
                                    {label}
                                </p>
                                <p className="font-poppins text-sm font-normal leading-relaxed text-[#484848]">
                                    {text}
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
