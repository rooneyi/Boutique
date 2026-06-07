import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SF_CAROUSEL_NAV_BTN, SF_SCROLL_X } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    children: ReactNode;
    className?: string;
    trackClassName?: string;
    showControls?: boolean;
    controlsClassName?: string;
    controlsVariant?: 'bottom' | 'floating-right';
    scrollStep?: number;
};

export function StorefrontHorizontalScroll({
    children,
    className,
    trackClassName,
    showControls = false,
    controlsClassName,
    controlsVariant = 'bottom',
    scrollStep,
}: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    function scroll(direction: 'left' | 'right') {
        const el = scrollRef.current;
        if (!el) {
            return;
        }

        const step = scrollStep ?? Math.min(el.clientWidth * 0.85, 380);
        el.scrollBy({
            left: direction === 'left' ? -step : step,
            behavior: 'smooth',
        });
    }

    return (
        <div className={cn(controlsVariant === 'floating-right' && 'relative', className)}>
            <div
                ref={scrollRef}
                className={cn(SF_SCROLL_X, 'flex', trackClassName)}
            >
                {children}
            </div>

            {showControls && controlsVariant === 'floating-right' ? (
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                        'absolute top-1/2 right-[35px] z-10 size-[50px] -translate-y-1/2 rounded-full border-neutral-300 bg-white shadow-sm hover:bg-neutral-50',
                        controlsClassName,
                    )}
                    onClick={() => scroll('right')}
                    aria-label="Suivant"
                >
                    <ChevronRight className="size-5" strokeWidth={2.5} />
                </Button>
            ) : null}

            {showControls && controlsVariant !== 'floating-right' ? (
                <div
                    className={cn(
                        'mt-6 flex items-center justify-center gap-[53px]',
                        controlsClassName,
                    )}
                >
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={SF_CAROUSEL_NAV_BTN}
                        onClick={() => scroll('left')}
                        aria-label="Précédent"
                    >
                        <ChevronLeft className="size-3.5" strokeWidth={2.5} />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={SF_CAROUSEL_NAV_BTN}
                        onClick={() => scroll('right')}
                        aria-label="Suivant"
                    >
                        <ChevronRight className="size-3.5" strokeWidth={2.5} />
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
