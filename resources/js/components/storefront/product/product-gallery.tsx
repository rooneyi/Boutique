import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SF_SCROLL_X } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    images: string[];
    alt: string;
};

export function ProductGallery({ images, alt }: Props) {
    const galleryImages = images.length > 0 ? images : [];
    const [activeIndex, setActiveIndex] = useState(0);
    const mainSrc = galleryImages[activeIndex];

    const go = (direction: -1 | 1) => {
        if (galleryImages.length <= 1) return;
        setActiveIndex(
            (i) => (i + direction + galleryImages.length) % galleryImages.length,
        );
    };

    return (
        <div
            className={cn(
                'flex h-full w-full min-h-0 flex-col gap-3',
                galleryImages.length > 1 && 'lg:flex-row lg:gap-2.5',
            )}
        >
            <div className="relative order-1 flex min-h-[min(400px,55vh)] flex-1 items-end justify-end overflow-hidden rounded-xl lg:order-2 lg:min-h-0 lg:h-full lg:p-0">
                {mainSrc ? (
                    <img
                        src={mainSrc}
                        alt={alt}
                        className="absolute inset-0 size-full object-cover"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-neutral-100">
                        <ShoppingCart className="size-20 text-neutral-300" />
                    </div>
                )}
                {galleryImages.length > 1 && (
                    <div className="relative z-10 m-4 flex gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-12 rounded-full border-neutral-300 bg-white/90"
                            onClick={() => go(-1)}
                            aria-label="Image précédente"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-12 rounded-full border-neutral-300 bg-white/90"
                            onClick={() => go(1)}
                            aria-label="Image suivante"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>
                )}
            </div>

            {galleryImages.length > 1 && (
            <div
                className={cn(
                    'order-2 flex flex-row gap-2.5 pb-1',
                    SF_SCROLL_X,
                    'lg:order-1 lg:h-full lg:shrink-0 lg:flex-col lg:justify-start lg:overflow-visible lg:pb-0',
                )}
            >
                {galleryImages.map((src, index) => (
                    <button
                        key={`${src}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                            'h-24 w-28 shrink-0 overflow-hidden rounded-[20px] border-2 transition-colors sm:h-[124px] sm:w-[140px]',
                            activeIndex === index
                                ? 'border-black'
                                : 'border-transparent opacity-70 hover:opacity-100',
                        )}
                    >
                        <img
                            src={src}
                            alt=""
                            className="size-full object-cover"
                        />
                    </button>
                ))}
            </div>
            )}
        </div>
    );
}
