import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    value: number | null | undefined;
    count?: number | null;
    size?: 'sm' | 'md';
    className?: string;
};

export function StarRatingDisplay({ value, count, size = 'sm', className }: Props) {
    const v = value == null || Number.isNaN(value) ? 0 : Math.min(5, Math.max(0, value));
    const full = Math.floor(v);
    const half = v - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    const dim = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

    return (
        <div className={cn('flex flex-wrap items-center gap-1 text-[#747474]', className)}>
            <span className="inline-flex items-center gap-0.5" aria-hidden>
                {Array.from({ length: full }).map((_, i) => (
                    <Star key={`f-${i}`} className={cn(dim, 'fill-amber-400 text-amber-400')} />
                ))}
                {half === 1 ? <Star className={cn(dim, 'fill-amber-400/50 text-amber-400')} /> : null}
                {Array.from({ length: empty }).map((_, i) => (
                    <Star key={`e-${i}`} className={cn(dim, 'text-neutral-300')} />
                ))}
            </span>
            {value != null && value > 0 && (
                <span className="font-poppins text-sm font-semibold text-black">{value.toFixed(1)}</span>
            )}
            {count != null && count > 0 && (
                <span className="font-poppins text-xs text-[#747474]">({count} avis)</span>
            )}
            {(count === 0 || count == null) && (value == null || value === 0) && (
                <span className="font-poppins text-xs text-[#747474]">Pas encore noté</span>
            )}
        </div>
    );
}
