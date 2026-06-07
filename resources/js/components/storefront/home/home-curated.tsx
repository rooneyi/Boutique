import { Link } from '@inertiajs/react';
import { StorefrontHorizontalScroll } from '@/components/storefront/storefront-horizontal-scroll';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

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

type Props = {
    /** Figma collection/1440 (209:4986) vs accueil */
    variant?: 'page' | 'collection';
};

/** Figma collection/1440 — section 209:4986 */
export function HomeCurated({ variant = 'page' }: Props) {
    const isCollection = variant === 'collection';
    const items = isCollection ? ITEMS : ITEMS.slice(0, 3);

    return (
        <section
            className={cn(
                'flex flex-col bg-white',
                isCollection ? 'gap-[11px] py-9' : 'py-16 lg:px-[100px] lg:py-[100px]',
            )}
        >
            <div
                className={cn(
                    'mx-auto w-full max-w-[1440px]',
                    isCollection ? 'px-4 sm:px-8 lg:px-14' : 'px-4 sm:px-8 lg:px-0',
                )}
            >
                <div className={cn(isCollection ? 'space-y-0.5 py-[18px]' : 'mb-8 space-y-1')}>
                    <h2
                        className={cn(
                            'font-poppins font-semibold text-black',
                            isCollection
                                ? 'text-[36px] leading-none'
                                : 'text-2xl leading-[1.2] sm:text-3xl lg:text-[36px] lg:leading-[44px]',
                        )}
                    >
                        Notre Sélection Pour Vous
                    </h2>
                    <p
                        className={cn(
                            'font-poppins font-medium text-[#747474]',
                            isCollection
                                ? 'text-xl'
                                : 'text-base leading-[1.5] sm:text-lg sm:leading-[28px] lg:text-xl lg:leading-[30px]',
                        )}
                    >
                        Lorem ipsum sit dolor amet pelentesque
                    </p>
                    <Link
                        href={route('customer.products.index')}
                        className={cn(
                            'font-poppins inline-block py-3 text-[13px] font-semibold text-black',
                            isCollection
                                ? 'border-b border-[#0059dd] pr-2.5'
                                : 'border-b border-black',
                        )}
                    >
                        VOIR LA COLLECTION
                    </Link>
                </div>
            </div>

            <StorefrontHorizontalScroll
                showControls
                controlsVariant={isCollection ? 'floating-right' : 'bottom'}
                trackClassName={cn(
                    'gap-1 pb-4',
                    isCollection ? 'pl-4 sm:pl-8 lg:pl-[50px]' : undefined,
                )}
                scrollStep={isCollection ? 496 : 400}
            >
                {items.map((item, index) => (
                    <Link
                        key={`${item.title}-${index}`}
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
                        <p className="mt-2.5 font-poppins text-2xl font-semibold text-black">
                            {item.title}
                        </p>
                        <p className="font-poppins text-base font-medium text-[#737373]">
                            {item.description}
                        </p>
                    </Link>
                ))}
            </StorefrontHorizontalScroll>
        </section>
    );
}
