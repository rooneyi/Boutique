import { HOME_ASSETS } from '@/lib/home-assets';

/** Dégradé bannière — Figma collection/1440 (147:3749) */
const COLLECTION_HERO_GRADIENT =
    'linear-gradient(90deg, #c07f12 10.25%, #c07f12 36.47%, #915e07 41%, #292d32 41%, #292d32 102.51%)';

const HERO_TITLE_CLASS =
    'font-poppins font-black uppercase leading-[1.05] tracking-tight text-white';

export function CollectionHero() {
    return (
        <section className="w-full">
            {/* Mobile — Figma collection/402 */}
            <div
                className="flex flex-col items-center justify-end px-4 pb-0 pt-6 lg:hidden"
                style={{ background: COLLECTION_HERO_GRADIENT }}
            >
                <div className="w-full max-w-[370px] space-y-4 text-white">
                    <h1 className={`${HERO_TITLE_CLASS} text-[36px]`}>
                        <span className="block">Gardons notre</span>
                        <span className="block">attitude</span>
                    </h1>
                    <p className="font-poppins text-[13px] leading-normal text-white/95">
                        Des pièces pensées pour exprimer qui vous êtes. Explorez la collection PCJ
                        et trouvez le style qui vous correspond.
                    </p>
                </div>
                <div className="relative mt-4 h-[451px] w-full max-w-[300px]">
                    <img
                        src={HOME_ASSETS.collectionHero}
                        alt=""
                        className="mx-auto size-full object-contain object-bottom"
                    />
                </div>
            </div>

            {/* Desktop — Figma 147:3749 */}
            <div className="hidden w-full lg:block">
                <div
                    className="mx-auto flex h-[575px] w-full max-w-[1440px] overflow-hidden"
                    style={{ background: COLLECTION_HERO_GRADIENT }}
                >
                    <div className="relative flex h-full w-[min(42%,520px)] shrink-0 items-end justify-center pl-[65px]">
                        <img
                            src={HOME_ASSETS.collectionHero}
                            alt=""
                            className="h-full w-auto max-w-full object-contain object-bottom"
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center pr-[48px] pl-10 xl:pl-16">
                        <div className="flex w-full max-w-[657px] flex-col gap-4 text-white">
                            <h1 className={`${HERO_TITLE_CLASS} text-[64px]`}>
                                <span className="block">Gardons notre</span>
                                <span className="block">attitude</span>
                            </h1>
                            <p className="font-poppins text-xl leading-normal text-white/95">
                                Des pièces pensées pour exprimer qui vous êtes. Explorez la
                                collection PCJ et trouvez le style qui vous correspond.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
