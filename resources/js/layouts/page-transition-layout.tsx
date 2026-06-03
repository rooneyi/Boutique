import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { MOTION_PAGE_ENTER } from '@/lib/motion-styles';
import { cn } from '@/lib/utils';

/**
 * Layout Inertia interne — `usePage` est valide ici (contrairement à `withApp`).
 */
export default function PageTransitionLayout({ children }: { children: ReactNode }) {
    const { url } = usePage();
    const reducedMotion = useReducedMotion();

    return (
        <div key={url} className={cn(!reducedMotion && MOTION_PAGE_ENTER)}>
            {children}
        </div>
    );
}
