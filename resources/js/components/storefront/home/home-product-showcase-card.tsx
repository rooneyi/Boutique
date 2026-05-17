import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { route } from '@/lib/route';
import { SF_PRODUCT_BUY_BTN } from '@/lib/storefront-ui-styles';

type Product = {
    id: number;
    name: string;
    price: number;
    image_path: string | null;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
};

type Props = {
    product: Product;
    size?: 'default' | 'compact';
};

export function HomeProductShowcaseCard({ product, size = 'default' }: Props) {
    const isCompact = size === 'compact';

    return (
        <article
            className={
                isCompact
                    ? 'relative flex h-[428px] w-full max-w-[322px] shrink-0 flex-col justify-end overflow-hidden rounded-[20px] shadow-[0_4px_2px_rgba(0,0,0,0.25)]'
                    : 'relative flex h-[503px] w-full max-w-[343px] shrink-0 flex-col justify-end overflow-hidden rounded-[20px] shadow-[0_4px_2px_rgba(0,0,0,0.25)]'
            }
        >
            <Link
                href={route('customer.products.show', product.id)}
                className="absolute inset-0 z-0"
            >
                {product.image_path ? (
                    <img
                        src={product.image_path}
                        alt=""
                        className="size-full object-cover"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-neutral-300">
                        <ShoppingCart className="size-16 text-neutral-500" />
                    </div>
                )}
            </Link>

            <div className="pointer-events-auto absolute top-2 right-2 z-20 flex size-[50px] items-center justify-center rounded-[27px] border border-white bg-white shadow-sm">
                <FavoriteButton
                    productId={product.id}
                    favorited={product.is_favorite}
                    variant="showcase"
                    openDrawerOnAdd={false}
                    className="hover:bg-transparent"
                />
            </div>

            <div className="relative z-10 flex flex-col gap-1 bg-gradient-to-b from-transparent via-black/60 to-black px-5 pb-8 pt-16">
                <Link href={route('customer.products.show', product.id)}>
                    <h3 className="font-poppins text-2xl font-bold text-white">
                        {product.name}
                    </h3>
                </Link>
                <StarRatingDisplay
                    value={product.rating_avg}
                    count={product.reviews_count}
                    className="text-white"
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="font-poppins text-2xl font-medium tracking-tight text-[#f5f5f5]">
                        {product.price.toFixed(2)} $
                    </p>
                    <AddToCartButton
                        productId={product.id}
                        className={SF_PRODUCT_BUY_BTN}
                        label="ACHETER"
                    />
                </div>
            </div>
        </article>
    );
}
