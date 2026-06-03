import { Link } from '@inertiajs/react';
import { StorefrontHorizontalScroll } from '@/components/storefront/storefront-horizontal-scroll';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { SF_SECTION_SUBTITLE, SF_SECTION_TITLE } from '@/lib/storefront-ui-styles';

const ITEMS = [
    {
        title: 'LE MANIFESTE',
        image: HOME_ASSETS.selectionManifeste,
        description:
            'Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero',
    },
    {
        title: 'STREET WEAR',
        image: HOME_ASSETS.wearLook1,
        description:
            'Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero',
    },
    {
        title: 'SIGNATURE PCJ',
        image: HOME_ASSETS.wearLook2,
        description:
            'Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero',
    },
] as const;

export function HomeCurated() {
    return (
        <section className="bg-white py-16 lg:px-[100px] lg:py-[100px]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-0">
                <div className="mb-8 space-y-1">
                    <h2 className={SF_SECTION_TITLE}>Notre Sélection Pour Vous</h2>
                    <p className={SF_SECTION_SUBTITLE}>
                        Lorem ipsum sit dolor amet pelentesque
                    </p>
                    <Link
                        href={route('customer.products.index')}
                        className="font-poppins inline-block border-b border-black py-3 text-[13px] font-semibold text-black"
                    >
                        VOIR LA COLLECTION
                    </Link>
                </div>

                <StorefrontHorizontalScroll
                    showControls
                    trackClassName="gap-1 pb-4"
                    scrollStep={400}
                >
                    {ITEMS.map((item) => (
                        <Link
                            key={item.title}
                            href={route('customer.products.index')}
                            className="w-[min(492px,85vw)] shrink-0 p-2"
                        >
                            <div className="aspect-[492/682] overflow-hidden">
                                <img
                                    src={item.image}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            </div>
                            <p className="mt-2 font-poppins text-2xl font-semibold text-black">
                                {item.title}
                            </p>
                            <p className="font-poppins text-base font-medium leading-[26px] text-[#737373]">
                                {item.description}
                            </p>
                        </Link>
                    ))}
                </StorefrontHorizontalScroll>
            </div>
        </section>
    );
}
