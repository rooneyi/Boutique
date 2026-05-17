import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { HomeProductShowcaseCard } from '@/components/storefront/home/home-product-showcase-card';
import { Button } from '@/components/ui/button';
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

export function FavoritesSuggestedCarousel({ products }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({
            left: direction === 'left' ? -380 : 380,
            behavior: 'smooth',
        });
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-7 px-4 sm:px-12 lg:px-[50px]">
                    <h2 className={SF_SECTION_TITLE}>Vous pourriez aimer aussi</h2>
                    <p className={`${SF_SECTION_SUBTITLE} mt-1`}>
                        Lorem ipsum sit dolor amet pelentesque
                    </p>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-7 overflow-x-auto pb-4 pl-4 shadow-[0_4px_2px_rgba(0,0,0,0.25)] sm:pl-12 lg:pl-[50px] scrollbar-thin"
                >
                    {products.map((product) => (
                        <HomeProductShowcaseCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-8">
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
            </div>
        </section>
    );
}
