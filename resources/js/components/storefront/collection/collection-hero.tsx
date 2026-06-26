import { HOME_ASSETS } from '@/lib/home-assets';

/** Dégradé bannière — Figma collection/1440 (147:3749) */
const COLLECTION_HERO_GRADIENT =
    'linear-gradient(90deg, #c07f12 10.25%, #c07f12 36.47%, #915e07 41%, #292d32 41%, #292d32 102.51%)';

const HERO_TITLE_CLASS =
    'font-[Impact,Haettenschweiler,Arial_Narrow_Bold,sans-serif] font-normal uppercase leading-tight tracking-tight text-white';

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
                        GARDONS NOTRE ATTITUDE
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
            <div className="hidden w-full px-4 sm:px-8 lg:block lg:px-[62px]">
                <div
                    className="mx-auto flex h-[575px] max-w-[1440px] items-center justify-between pl-[65px] pr-[48px]"
                    style={{ background: COLLECTION_HERO_GRADIENT }}
                >
                    <div className="relative h-[575px] w-[382px] shrink-0 overflow-hidden">
                        <img
                            src={HOME_ASSETS.collectionHero}
                            alt=""
                            className="absolute left-[-17%] top-[-30%] h-[137%] w-[148%] max-w-none object-cover"
                        />
                    </div>
                    <div className="flex max-w-[657px] flex-col gap-4 text-white">
                        <h1 className={`${HERO_TITLE_CLASS} text-[64px]`}>
                            GARDONS NOTRE ATTITUDE
                        </h1>
                        <p className="font-poppins text-xl leading-normal text-white/95">
                            Des pièces pensées pour exprimer qui vous êtes. Explorez la collection
                            PCJ et trouvez le style qui vous correspond.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
