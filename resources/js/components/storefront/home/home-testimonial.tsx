import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { HOME_ASSETS } from '@/lib/home-assets';

export function HomeTestimonial() {
    return (
        <section className="bg-white py-12 md:py-16">
            <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 sm:px-8">
                <div className="flex w-full items-center gap-4 md:gap-12">
                    <button
                        type="button"
                        className="hidden shrink-0 text-neutral-400 md:block"
                        aria-label="Témoignage précédent"
                    >
                        <ChevronLeft className="size-10" />
                    </button>

                    <div className="grid flex-1 items-center gap-8 lg:grid-cols-2">
                        <div className="space-y-6">
                            <h2 className="font-poppins text-[clamp(2.5rem,6vw,5.25rem)] font-bold leading-tight text-black">
                                On en parle
                            </h2>
                            <div className="space-y-4">
                                <StarRatingDisplay value={5} count={1} size="md" />
                                <blockquote className="font-poppins text-xl leading-relaxed text-black md:text-2xl">
                                    &ldquo;J&apos;adore ce T-Shirt ! Il taille parfaitement et le
                                    tissu est épais sans être rigide.&rdquo;
                                </blockquote>
                                <p className="font-poppins text-sm tracking-widest text-black">
                                    -- Sarah Mutomb, T-Shirt Oversize
                                </p>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-lg lg:h-[min(733px,70vh)]">
                            <img
                                src={HOME_ASSETS.testimonial}
                                alt="Cliente satisfaite"
                                className="size-full object-cover"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="hidden shrink-0 text-neutral-400 md:block"
                        aria-label="Témoignage suivant"
                    >
                        <ChevronRight className="size-10" />
                    </button>
                </div>

                <div className="flex gap-2">
                    <span className="size-2.5 rounded-full bg-black" />
                    <span className="size-2.5 rounded-full bg-neutral-300" />
                    <span className="size-2.5 rounded-full bg-neutral-300" />
                </div>
            </div>
        </section>
    );
}
