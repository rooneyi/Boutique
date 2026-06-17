import { ProductColorPicker } from '@/components/admin/product-color-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { ADMIN_MUTED } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

export type VariantRow = {
    color: string;
    color_hex: string;
    size: string;
    sku: string;
    stock: string;
};

type SizeRow = {
    size: string;
    sku: string;
    stock: string;
};

export type ColorGroup = {
    color: string;
    color_hex: string;
    sizes: SizeRow[];
};

type Props = {
    groups: ColorGroup[];
    sizes: string[];
    processing?: boolean;
    onChange: (groups: ColorGroup[]) => void;
    errors?: string;
};

function emptySizeRow(defaultSize: string): SizeRow {
    return { size: defaultSize, sku: '', stock: '0' };
}

function emptyColorGroup(defaultSize: string): ColorGroup {
    return { color: 'Noir', color_hex: '#000000', sizes: [emptySizeRow(defaultSize)] };
}

export function groupsFromVariants(
    variants: { color: string; color_hex: string | null; size: string; sku: string | null; stock: number }[] | undefined,
    defaultSize: string,
): ColorGroup[] {
    if (!variants?.length) {
        return [emptyColorGroup(defaultSize)];
    }

    const map = new Map<string, ColorGroup>();
    for (const v of variants) {
        const key = v.color.trim().toLowerCase();
        if (!map.has(key)) {
            map.set(key, {
                color: v.color,
                color_hex: v.color_hex ?? '#000000',
                sizes: [],
            });
        }
        map.get(key)!.sizes.push({
            size: v.size,
            sku: v.sku ?? '',
            stock: String(v.stock),
        });
    }

    return Array.from(map.values());
}

export function flattenVariantGroups(groups: ColorGroup[]): VariantRow[] {
    const rows: VariantRow[] = [];
    for (const group of groups) {
        for (const sizeRow of group.sizes) {
            rows.push({
                color: group.color,
                color_hex: group.color_hex,
                size: sizeRow.size,
                sku: sizeRow.sku,
                stock: sizeRow.stock,
            });
        }
    }

    return rows;
}

export function AdminProductVariantEditor({
    groups,
    sizes,
    processing = false,
    onChange,
    errors,
}: Props) {
    const defaultSize = sizes[2] ?? 'M';

    function updateGroup(index: number, patch: Partial<ColorGroup>) {
        onChange(groups.map((g, i) => (i === index ? { ...g, ...patch } : g)));
    }

    function updateSize(groupIndex: number, sizeIndex: number, patch: Partial<SizeRow>) {
        onChange(
            groups.map((g, gi) => {
                if (gi !== groupIndex) {
                    return g;
                }
                return {
                    ...g,
                    sizes: g.sizes.map((s, si) => (si === sizeIndex ? { ...s, ...patch } : s)),
                };
            }),
        );
    }

    function addColor() {
        onChange([...groups, emptyColorGroup(defaultSize)]);
    }

    function removeColor(index: number) {
        if (groups.length <= 1) {
            return;
        }
        onChange(groups.filter((_, i) => i !== index));
    }

    function addSize(groupIndex: number) {
        onChange(
            groups.map((g, i) => {
                if (i !== groupIndex) {
                    return g;
                }
                const used = new Set(g.sizes.map((s) => s.size));
                const next = sizes.find((s) => !used.has(s)) ?? defaultSize;
                return { ...g, sizes: [...g.sizes, emptySizeRow(next)] };
            }),
        );
    }

    function removeSize(groupIndex: number, sizeIndex: number) {
        onChange(
            groups.map((g, i) => {
                if (i !== groupIndex || g.sizes.length <= 1) {
                    return g;
                }
                return { ...g, sizes: g.sizes.filter((_, si) => si !== sizeIndex) };
            }),
        );
    }

    const flatRows = flattenVariantGroups(groups);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                    <Label className="font-poppins text-[20px] font-semibold text-[#747474]">
                        Couleurs & tailles
                    </Label>
                    <p className={cn(ADMIN_MUTED, 'mt-1 text-sm')}>
                        Un seul produit — ajoutez les couleurs, puis les tailles et stocks pour chacune.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="font-poppins"
                    onClick={addColor}
                    disabled={processing}
                >
                    <Plus className="mr-1 size-4" />
                    Ajouter une couleur
                </Button>
            </div>

            {errors ? <p className="font-poppins text-sm text-red-600">{errors}</p> : null}

            <div className="space-y-4">
                {groups.map((group, groupIndex) => (
                    <div
                        key={`color-${groupIndex}-${group.color}`}
                        className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-200 pb-4">
                            <ProductColorPicker
                                color={group.color}
                                colorHex={group.color_hex}
                                disabled={processing}
                                onChange={(patch) => updateGroup(groupIndex, patch)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="font-poppins text-[#747474] hover:text-red-600"
                                onClick={() => removeColor(groupIndex)}
                                disabled={processing || groups.length <= 1}
                            >
                                <Trash2 className="mr-1 size-4" />
                                Retirer la couleur
                            </Button>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="hidden gap-3 px-1 text-xs font-medium uppercase tracking-wide text-[#999] sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_auto]">
                                <span>Taille</span>
                                <span>Réf. (SKU)</span>
                                <span>Stock</span>
                                <span className="sr-only">Actions</span>
                            </div>

                            {group.sizes.map((sizeRow, sizeIndex) => (
                                <div
                                    key={`size-${groupIndex}-${sizeIndex}-${sizeRow.size}`}
                                    className="grid gap-3 rounded-md border border-neutral-100 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-end"
                                >
                                    <div className="grid gap-1">
                                        <Label className="text-sm font-medium text-[#747474] sm:sr-only">
                                            Taille
                                        </Label>
                                        <Select
                                            value={sizeRow.size}
                                            onValueChange={(v) => updateSize(groupIndex, sizeIndex, { size: v })}
                                        >
                                            <SelectTrigger className="font-poppins">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sizes.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {s}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1">
                                        <Label className="text-sm font-medium text-[#747474] sm:sr-only">
                                            SKU
                                        </Label>
                                        <Input
                                            value={sizeRow.sku}
                                            onChange={(e) =>
                                                updateSize(groupIndex, sizeIndex, { sku: e.target.value })
                                            }
                                            placeholder="PCJ-TEE-NOIR-M"
                                            disabled={processing}
                                            className="font-poppins"
                                        />
                                    </div>

                                    <div className="grid gap-1">
                                        <Label className="text-sm font-medium text-[#747474] sm:sr-only">
                                            Stock
                                        </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            value={sizeRow.stock}
                                            onChange={(e) =>
                                                updateSize(groupIndex, sizeIndex, { stock: e.target.value })
                                            }
                                            required
                                            disabled={processing}
                                            className="font-poppins"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-[#747474] hover:text-red-600"
                                            onClick={() => removeSize(groupIndex, sizeIndex)}
                                            disabled={processing || group.sizes.length <= 1}
                                            aria-label="Supprimer la taille"
                                        >
                                            <Trash2 className="size-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="font-poppins"
                                onClick={() => addSize(groupIndex)}
                                disabled={processing}
                            >
                                <Plus className="mr-1 size-4" />
                                Ajouter une taille
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {flatRows.map((row, index) => (
                <div key={`hidden-${index}`} className="hidden" aria-hidden>
                    <input type="hidden" name={`variants[${index}][color]`} value={row.color} />
                    <input type="hidden" name={`variants[${index}][color_hex]`} value={row.color_hex} />
                    <input type="hidden" name={`variants[${index}][size]`} value={row.size} />
                    <input type="hidden" name={`variants[${index}][sku]`} value={row.sku} />
                    <input type="hidden" name={`variants[${index}][stock]`} value={row.stock} />
                </div>
            ))}
        </div>
    );
}
