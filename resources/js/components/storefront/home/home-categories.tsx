import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_PILL_BTN_LIGHT, SF_SECTION_SUBTITLE, SF_SECTION_TITLE } from '@/lib/storefront-ui-styles';

const CATEGORIES = [
    {
        title: 'Pull',
        category: 'Pull',
        image: HOME_ASSETS.categoryPull,
        cta: 'VOIR LES PULLS',
    },
    {
        title: 'T-Shirt',
        category: 'T-shirt',
        image: HOME_ASSETS.categoryTshirt,
        cta: 'VOIR LES T-SHIRTS',
    },
    {
        title: 'Casquette',
        category: 'Casquette',
        image: HOME_ASSETS.categoryCap,
        cta: 'VOIR LES CASQUETTES',
    },
] as const;

function collectionCategoryHref(category: string): string {
    const params = new URLSearchParams({ category, sort: 'popular' });
    return `${route('customer.products.index')}?${params.toString()}`;
}

export function HomeCategories() {
    return (
        <section className="bg-[#f0f0f0] py-16 lg:py-16">
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[30px] px-4 sm:px-8">
                <div className="space-y-1 p-5 text-center">
                    <h2 className={SF_SECTION_TITLE}>Catégories</h2>
                    <p className={SF_SECTION_SUBTITLE}>
                        Explorez nos pulls, t-shirts et casquettes — des essentiels pour votre style au quotidien.
                    </p>
                </div>

                <div className="flex w-full flex-col items-stretch justify-center gap-[18px] md:flex-row md:items-end">
                    {CATEGORIES.map((cat, index) => (
                        <Link
                            key={cat.title}
                            href={collectionCategoryHref(cat.category)}
                            className={`relative mx-auto flex w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-[23px] ${
                                index === 1
                                    ? 'h-[min(350px,55vh)] max-w-none md:h-[min(570px,70vh)] md:max-w-[400px]'
                                    : 'h-[240px] max-w-none md:h-[390px] md:max-w-[320px]'
                            }`}
                        >
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="absolute inset-0 size-full object-cover"
                            />
                            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-2.5 bg-black/30 px-5 py-4">
                                <p className="font-poppins text-2xl font-bold text-white sm:text-[32px]">
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
