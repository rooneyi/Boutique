import { Link } from '@inertiajs/react';
import { StorefrontHorizontalScroll } from '@/components/storefront/storefront-horizontal-scroll';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

export type CuratedProduct = {
    id: number;
    name: string;
    description: string;
    image_path: string | null;
};

type Props = {
    /** Figma collection/1440 (209:4986) vs accueil */
    variant?: 'page' | 'collection';
    products?: CuratedProduct[];
};

/** Figma collection/1440 — section 209:4986 */
export function HomeCurated({ variant = 'page', products = [] }: Props) {
    const isCollection = variant === 'collection';
    const items = products.slice(0, isCollection ? 4 : 3);

    if (items.length === 0) {
        return null;
    }

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
                        className="font-poppins inline-block border-b border-[#0059DD] py-3 pr-2.5 text-[13px] font-semibold text-black"
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
                {items.map((product) => (
                    <Link
                        key={product.id}
                        href={route('customer.products.show', product.id)}
                        className="w-[min(492px,85vw)] shrink-0 p-2 transition-opacity hover:opacity-95"
                    >
                        <div className="aspect-[492/682] overflow-hidden rounded-sm bg-neutral-100">
                            {product.image_path ? (
                                <img
                                    src={product.image_path}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center bg-neutral-200 font-poppins text-sm text-[#747474]">
                                    {product.name}
                                </div>
                            )}
                        </div>
                        <p className="mt-2.5 font-poppins text-2xl font-semibold text-black">
                            {product.name}
                        </p>
                        <p className="font-poppins text-base font-medium text-[#737373]">
                            {product.description}
                        </p>
                    </Link>
                ))}
            </StorefrontHorizontalScroll>
        </section>
    );
}
