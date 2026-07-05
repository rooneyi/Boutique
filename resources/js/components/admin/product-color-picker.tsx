import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    CATALOG_COLOR_PRESETS,
    CUSTOM_COLOR_VALUE,
    findPresetByHex,
    findPresetByName,
} from '@/lib/product-colors';
import { cn } from '@/lib/utils';

type Props = {
    color: string;
    colorHex: string;
    onChange: (patch: { color: string; color_hex: string }) => void;
    disabled?: boolean;
    labelClassName?: string;
};

export function ProductColorPicker({ color, colorHex, onChange, disabled, labelClassName }: Props) {
    const preset = findPresetByName(color);
    const [isCustomMode, setIsCustomMode] = useState(() => !preset && color.trim().length > 0);

    useEffect(() => {
        if (findPresetByName(color)) {
            setIsCustomMode(false);
        }
    }, [color]);

    const selectValue = isCustomMode ? CUSTOM_COLOR_VALUE : (preset?.name ?? '');

    const handlePresetChange = (value: string) => {
        if (value === CUSTOM_COLOR_VALUE) {
            setIsCustomMode(true);
            onChange({
                color: preset ? 'Couleur' : color.trim() || 'Couleur',
                color_hex: colorHex || '#000000',
            });
            return;
        }
        setIsCustomMode(false);
        const match = CATALOG_COLOR_PRESETS.find((p) => p.name === value);
        if (match) {
            onChange({ color: match.name, color_hex: match.hex });
        }
    };

    const handleHexChange = (hex: string) => {
        const fromHex = findPresetByHex(hex);
        if (fromHex) {
            setIsCustomMode(false);
        }
        onChange({
            color: fromHex?.name ?? (color.trim() || 'Couleur'),
            color_hex: hex,
        });
    };

    const isCustom = isCustomMode;

    return (
        <div className="grid gap-2 sm:col-span-2">
            <Label className={cn('text-sm font-medium text-[#747474]', labelClassName)}>Couleur</Label>
            <Select value={selectValue} onValueChange={handlePresetChange} disabled={disabled}>
                <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Choisir une couleur" />
                </SelectTrigger>
                <SelectContent>
                    {CATALOG_COLOR_PRESETS.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                            <span className="flex items-center gap-2">
                                <span
                                    className={cn(
                                        'size-4 shrink-0 rounded-full border',
                                        p.hex === '#FFFFFF' ? 'border-neutral-300' : 'border-transparent',
                                    )}
                                    style={{ backgroundColor: p.hex }}
                                    aria-hidden
                                />
                                {p.name}
                            </span>
                        </SelectItem>
                    ))}
                    <SelectItem value={CUSTOM_COLOR_VALUE}>Personnalisée…</SelectItem>
                </SelectContent>
            </Select>

            {isCustom ? (
                <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                        value={color}
                        onChange={(e) => onChange({ color: e.target.value, color_hex: colorHex })}
                        placeholder="Nom affiché (ex. Rouge)"
                        required
                        disabled={disabled}
                        className="font-poppins"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={colorHex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            className="h-10 w-14 shrink-0 cursor-pointer rounded border border-neutral-200"
                            disabled={disabled}
                            aria-label="Teinte"
                        />
                        <span className="font-mono text-xs text-[#747474]">{colorHex}</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'size-6 rounded-full border',
                            colorHex === '#FFFFFF' ? 'border-neutral-300' : 'border-transparent',
                        )}
                        style={{ backgroundColor: colorHex }}
                        aria-hidden
                    />
                    <span className="font-poppins text-sm text-[#747474]">{color || '—'}</span>
                </div>
            )}
        </div>
    );
}
