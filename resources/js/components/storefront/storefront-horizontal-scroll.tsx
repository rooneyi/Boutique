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
    scrollStep?: number;
};

export function StorefrontHorizontalScroll({
    children,
    className,
    trackClassName,
    showControls = false,
    controlsClassName,
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
        <div className={className}>
            <div
                ref={scrollRef}
                className={cn(SF_SCROLL_X, 'flex', trackClassName)}
            >
                {children}
            </div>

            {showControls ? (
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
