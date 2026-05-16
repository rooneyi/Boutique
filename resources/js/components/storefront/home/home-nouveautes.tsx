import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { HomeProductShowcaseCard } from '@/components/storefront/home/home-product-showcase-card';
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
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({
            left: direction === 'left' ? -380 : 380,
            behavior: 'smooth',
        });
    };

    return (
        <section className="bg-[#f0f0f0] py-16 md:py-24">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
                <div className="mb-10 text-center">
                    <h2 className={SF_SECTION_TITLE}>Nouveautés</h2>
                    <p className={`${SF_SECTION_SUBTITLE} mt-1`}>
                        Lorem ipsum sit dolor amet pelentesque
                    </p>
                </div>

                {products.length === 0 ? (
                    <p className="text-center font-poppins text-[#747474]">
                        Aucun produit pour l&apos;instant.
                    </p>
                ) : (
                    <>
                        <div
                            ref={scrollRef}
                            className="flex gap-7 overflow-x-auto pb-4 scrollbar-thin"
                        >
                            {products.map((product) => (
                                <HomeProductShowcaseCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                        <div className="mt-6 flex items-center justify-center gap-8">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-10 rounded-full border-neutral-300"
                                onClick={() => scroll('left')}
                                aria-label="Précédent"
                            >
                                <ChevronLeft className="size-5" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="size-10 rounded-full border-neutral-300"
                                onClick={() => scroll('right')}
                                aria-label="Suivant"
                            >
                                <ChevronRight className="size-5" />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
