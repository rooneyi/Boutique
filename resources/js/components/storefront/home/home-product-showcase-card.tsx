import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { route } from '@/lib/route';
import { SF_PRODUCT_BUY_BTN } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Product = {
    id: number;
    name: string;
    price: number;
    image_path: string | null;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
    default_variant_id?: number | null;
};

type Props = {
    product: Product;
    size?: 'default' | 'compact' | 'collection' | 'favorites';
};

export function HomeProductShowcaseCard({ product, size = 'default' }: Props) {
    const isCollection = size === 'collection';
    const isCompact = size === 'compact';
    const isFavorites = size === 'favorites';
    const productHref = route('customer.products.show', product.id);

    return (
        <article
            className={cn(
                'motion-card-lift group relative flex cursor-pointer flex-col justify-end overflow-hidden rounded-[20px] shadow-[0_4px_2px_rgba(0,0,0,0.25)]',
                isFavorites && 'h-[428px] w-full max-w-[322px]',
                isCollection &&
                    'collection-card h-[251.5px] w-[171.5px] shrink-0 lg:h-[503px] lg:w-[343px]',
                isCompact &&
                    'h-[252px] w-full lg:h-[428px] lg:max-w-[322px]',
                !isFavorites &&
                    !isCollection &&
                    !isCompact &&
                    'h-[min(503px,70vh)] w-full max-w-[343px] shrink-0',
            )}
        >
            <div className="absolute inset-0 z-0" aria-hidden>
                {product.image_path ? (
                    <img
                        src={product.image_path}
                        alt=""
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-neutral-300">
                        <ShoppingCart className="size-16 text-neutral-500" />
                    </div>
                )}
            </div>

            <div
                className={cn(
                    'pointer-events-auto absolute top-2 right-2 z-30 flex items-center justify-center rounded-[27px] border border-white bg-white shadow-sm',
                    (isCompact || isCollection) && !isFavorites
                        ? 'size-[25px] p-1 lg:size-[50px] lg:p-0'
                        : 'size-[50px]',
                )}
            >
                <FavoriteButton
                    productId={product.id}
                    favorited={product.is_favorite}
                    variant="showcase"
                    openDrawerOnAdd={false}
                    className="hover:bg-transparent"
                />
            </div>

            <div
                className={cn(
                    'relative z-[5] flex flex-col bg-gradient-to-b from-[rgba(26,24,24,0)] via-[30%] via-[rgba(31,31,31,0.6)] to-[66.346%] to-black',
                    isFavorites
                        ? 'gap-[5px] px-5 pb-[30px] pt-5'
                        : isCollection
                          ? 'gap-[5px] px-2.5 pb-4 pt-10 lg:gap-[5px] lg:px-5 lg:pb-[30px] lg:pt-5'
                          : isCompact
                            ? 'gap-0.5 px-2.5 pb-4 pt-10 lg:gap-1 lg:px-5 lg:pb-8 lg:pt-16'
                            : 'gap-1 px-5 pb-8 pt-16',
                )}
            >
                <h3
                    className={cn(
                        'font-poppins font-bold text-white',
                        isFavorites || (!isCompact && !isCollection)
                            ? 'text-2xl'
                            : 'text-sm lg:text-2xl',
                    )}
                >
                    {product.name}
                </h3>
                <StarRatingDisplay
                    value={product.rating_avg}
                    count={product.reviews_count}
                    className={cn(
                        'text-white',
                        (isCompact || isCollection) &&
                            !isFavorites &&
                            'origin-left scale-75 lg:scale-100',
                    )}
                />
                <div className="relative z-30 mt-1 flex items-center justify-between gap-2 lg:mt-2 lg:gap-3">
                    <p
                        className={cn(
                            'font-poppins font-medium tracking-tight text-[#f5f5f5]',
                            isFavorites || (!isCompact && !isCollection)
                                ? 'text-2xl'
                                : 'text-xs lg:text-2xl',
                        )}
                    >
                        {product.price.toFixed(2)} $
                    </p>
                    <AddToCartButton
                        productId={product.id}
                        defaultVariantId={product.default_variant_id}
                        className={cn(
                            SF_PRODUCT_BUY_BTN,
                            'relative z-30',
                            (isCompact || isCollection) &&
                                !isFavorites &&
                                'h-auto px-2 py-1 text-[7.5px] lg:px-4 lg:py-2.5 lg:text-sm',
                        )}
                        label="ACHETER"
                    />
                </div>
            </div>

            <Link
                href={productHref}
                className="absolute inset-0 z-20 rounded-[20px]"
                aria-label={`Voir ${product.name}`}
            />
        </article>
    );
}
