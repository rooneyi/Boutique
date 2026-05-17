import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_PILL_BTN_LIGHT, SF_SECTION_SUBTITLE, SF_SECTION_TITLE } from '@/lib/storefront-ui-styles';

const CATEGORIES = [
    {
        title: 'Pull',
        image: HOME_ASSETS.categoryPull,
        cta: 'VOIR LES PULLS',
        height: 'h-[390px]',
        width: 'w-full max-w-[320px]',
    },
    {
        title: 'T-Shirt',
        image: HOME_ASSETS.categoryTshirt,
        cta: 'VOIR LES T-SHIRTS',
        height: 'h-[min(570px,70vh)]',
        width: 'w-full max-w-[400px]',
    },
    {
        title: 'Casquette',
        image: HOME_ASSETS.categoryCap,
        cta: 'VOIR LES CASQUETTES',
        height: 'h-[390px]',
        width: 'w-full max-w-[320px]',
    },
] as const;

export function HomeCategories() {
    return (
        <section className="bg-[#f0f0f0] py-16">
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[30px] px-4 sm:px-8">
                <div className="text-center">
                    <h2 className={SF_SECTION_TITLE}>Catégories</h2>
                    <p className={`${SF_SECTION_SUBTITLE} mt-1`}>
                        Lorem ipsum sit dolor amet pelentesque
                    </p>
                </div>

                <div className="flex w-full flex-col items-center justify-center gap-[18px] md:flex-row md:items-end">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.title}
                            href={route('customer.products.index')}
                            className={`relative flex ${cat.height} ${cat.width} shrink-0 flex-col items-center justify-center overflow-hidden rounded-[23px]`}
                        >
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="absolute inset-0 size-full object-cover"
                            />
                            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-2.5 bg-black/30 px-5 py-4">
                                <p className="font-poppins text-[32px] font-bold text-white">
                                    {cat.title}
                                </p>
                                <span className={SF_PILL_BTN_LIGHT}>{cat.cta}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
