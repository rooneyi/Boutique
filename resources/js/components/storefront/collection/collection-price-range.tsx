import { cn } from '@/lib/utils';

type Props = {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    className?: string;
};

/** Slider prix double poignée — Figma collection (361:4699) */
export function CollectionPriceRange({ min, max, value, onChange, className }: Props) {
    const [low, high] = value;
    const span = Math.max(max - min, 1);
    const lowPct = ((low - min) / span) * 100;
    const highPct = ((high - min) / span) * 100;
    const disabled = min >= max;

    const setLow = (next: number) => {
        onChange([Math.min(next, high), high]);
    };

    const setHigh = (next: number) => {
        onChange([low, Math.max(next, low)]);
    };

    return (
        <div className={cn('collection-price-range space-y-2', className)}>
            <div className="relative mx-0.5 h-4">
                <div
                    className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-[#e6e6e6]"
                    aria-hidden
                />
                {!disabled ? (
                    <div
                        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-black"
                        style={{
                            left: `${lowPct}%`,
                            width: `${Math.max(highPct - lowPct, 0)}%`,
                        }}
                        aria-hidden
                    />
                ) : null}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={low}
                    disabled={disabled}
                    onChange={(e) => setLow(Number(e.target.value))}
                    className="collection-price-range__input collection-price-range__input--low"
                    aria-label="Prix minimum"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={high}
                    disabled={disabled}
                    onChange={(e) => setHigh(Number(e.target.value))}
                    className="collection-price-range__input collection-price-range__input--high"
                    aria-label="Prix maximum"
                />
            </div>
            <div className="flex justify-between text-base font-medium text-[rgba(91,94,100,0.62)]">
                <span>{low}</span>
                <span>{high}</span>
            </div>
        </div>
    );
}
