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
};

type Props = {
    products: Product[];
};

export function HomeNouveautes({ products }: Props) {
    return (
        <section className="bg-[#f0f0f0] py-16 lg:px-[100px] lg:py-[100px]">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-0">
                <div className="mb-10 space-y-1 p-5 text-center">
                    <h2 className={SF_SECTION_TITLE}>Nouveautés</h2>
                    <p className={SF_SECTION_SUBTITLE}>
                        Les dernières pièces arrivées en boutique, sélectionnées pour affirmer votre attitude.
                    </p>
                </div>

                {products.length === 0 ? (
                    <p className="text-center font-poppins text-[#747474]">
                        Aucun produit pour l&apos;instant.
                    </p>
                ) : (
                    <StorefrontHorizontalScroll
                        showControls
                        trackClassName="product-card-track gap-7 pb-4"
                        scrollStep={320}
                    >
                        {products.map((product) => (
                            <HomeProductShowcaseCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </StorefrontHorizontalScroll>
                )}
            </div>
        </section>
    );
}
