import { HOME_ASSETS } from '@/lib/home-assets';

/** Bannière page À propos — dérivée accueil / contact */
export function AboutHero() {
    return (
        <section className="w-full bg-[#292d32]">
            <div className="mx-auto flex h-[min(420px,55vh)] max-w-[1440px] flex-col items-start justify-center gap-4 px-4 py-12 sm:px-8 lg:h-[480px] lg:flex-row lg:items-center lg:justify-between lg:px-[100px] lg:py-0">
                <div className="max-w-xl text-white">
                    <p className="font-poppins text-sm font-semibold uppercase tracking-widest text-[#c07f12]">
                        POSE COMME JAMAIS
                    </p>
                    <h1 className="mt-2 font-poppins text-[clamp(2.5rem,8vw,4rem)] font-extrabold leading-tight">
                        À Propos
                    </h1>
                    <p className="mt-4 font-poppins text-base leading-relaxed text-white/90 lg:text-lg">
                        Gardons notre attitude — découvrez l&apos;univers PCJ, nos valeurs et notre
                        engagement pour une mode responsable.
                    </p>
                </div>
                <div className="h-[min(280px,40vh)] w-full max-w-[400px] shrink-0 overflow-hidden rounded-[20px] lg:h-[360px]">
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
