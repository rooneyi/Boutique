import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { HOME_ASSETS } from '@/lib/home-assets';
import { cn } from '@/lib/utils';

export type HomeTestimonialItem = {
    id: number;
    rating: number;
    comment: string;
    author: string;
    product_name: string;
};

const FALLBACK: HomeTestimonialItem = {
    id: 0,
    rating: 5,
    comment:
        "J'adore ce T-Shirt ! Il taille parfaitement et le tissu est épais sans être rigide.",
    author: 'Sarah Mutomb',
    product_name: 'T-Shirt Oversize',
};

const AUTO_PLAY_MS = 6000;

type Props = {
    testimonials?: HomeTestimonialItem[];
};

export function HomeTestimonial({ testimonials = [] }: Props) {
    const items = testimonials.length > 0 ? testimonials : [FALLBACK];
    const [index, setIndex] = useState(0);
    const count = items.length;
    const current = items[index] ?? items[0];

    const goTo = useCallback(
        (next: number) => {
            if (count <= 0) {
                return;
            }
            setIndex(((next % count) + count) % count);
        },
        [count],
    );

    const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
    const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

    useEffect(() => {
        setIndex(0);
    }, [count]);

    useEffect(() => {
        if (count <= 1) {
            return;
        }
        const timer = window.setInterval(() => {
            setIndex((i) => (i + 1) % count);
        }, AUTO_PLAY_MS);
        return () => window.clearInterval(timer);
    }, [count]);

    return (
        <section className="bg-white py-16 lg:px-[100px] lg:py-[100px]">
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 sm:px-8 lg:px-0">
                <div className="flex w-full items-center gap-4 md:gap-12">
                    <button
                        type="button"
                        className="hidden shrink-0 text-neutral-400 transition-colors hover:text-black disabled:opacity-30 md:block"
                        aria-label="Avis précédent"
                        onClick={goPrev}
                        disabled={count <= 1}
                    >
                        <ChevronLeft className="size-10" />
                    </button>

                    <div className="grid flex-1 grid-cols-1 items-center gap-8 lg:grid-cols-2">
                        <div className="order-1 space-y-6 lg:order-none">
                            <h2 className="font-poppins text-[clamp(2.5rem,6vw,5.25rem)] font-bold leading-normal text-black">
                                On en parle
                            </h2>
                            <div
                                key={current.id}
                                className="motion-fade-up space-y-4"
                                aria-live="polite"
                            >
                                <StarRatingDisplay value={current.rating} count={1} size="md" />
                                <blockquote className="font-poppins text-xl leading-[30px] text-black md:text-2xl md:leading-[36px]">
                                    &ldquo;{current.comment}&rdquo;
                                </blockquote>
                                <p className="font-poppins text-sm tracking-widest text-black">
                                    -- {current.author}, {current.product_name}
                                </p>
                            </div>
                        </div>

                        <div className="order-2 overflow-hidden rounded-lg lg:order-none lg:h-[min(733px,70vh)]">
                            <img
                                key={current.id}
                                src={HOME_ASSETS.testimonial}
                                alt="Cliente satisfaite"
                                className="motion-fade-up size-full object-cover"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="hidden shrink-0 text-neutral-400 transition-colors hover:text-black disabled:opacity-30 md:block"
                        aria-label="Avis suivant"
                        onClick={goNext}
                        disabled={count <= 1}
                    >
                        <ChevronRight className="size-10" />
                    </button>
                </div>

                {count > 1 ? (
                    <div className="flex items-center gap-2" role="tablist" aria-label="Avis clients">
                        {items.map((item, i) => (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                aria-label={`Avis ${i + 1} sur ${count}`}
                                onClick={() => goTo(i)}
                                className={cn(
                                    'rounded-full transition-all duration-300 ease-out',
                                    i === index
                                        ? 'size-[11px] bg-black ring-4 ring-black/10'
                                        : 'size-[11px] bg-neutral-300 hover:bg-neutral-400',
                                )}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
