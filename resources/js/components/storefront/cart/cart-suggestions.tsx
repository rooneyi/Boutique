import { HomeProductShowcaseCard } from '@/components/storefront/home/home-product-showcase-card';
import { StorefrontHorizontalScroll } from '@/components/storefront/storefront-horizontal-scroll';
import { SF_SECTION_SUBTITLE, SF_SECTION_TITLE } from '@/lib/storefront-ui-styles';

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
    products: Product[];
};

export function CartSuggestions({ products }: Props) {
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-[60px]">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-7 px-4 py-5 sm:px-12 lg:px-[50px]">
                    <h2 className={SF_SECTION_TITLE}>Vous pourriez aimer aussi</h2>
                    <p className={`${SF_SECTION_SUBTITLE} mt-1`}>
                        Découvrez d&apos;autres pièces qui pourraient compléter votre look.
                    </p>
                </div>

                <StorefrontHorizontalScroll
                    showControls
                    className="shadow-[0_4px_2px_rgba(0,0,0,0.25)]"
                    trackClassName="product-card-track gap-7 pb-4 pl-4 sm:pl-12 lg:pl-[50px]"
                    controlsClassName="mt-8"
                    scrollStep={360}
                >
                    {products.map((product) => (
                        <HomeProductShowcaseCard key={product.id} product={product} />
                    ))}
                </StorefrontHorizontalScroll>
            </div>
        </section>
    );
}
