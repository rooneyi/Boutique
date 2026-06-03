/** Couleurs catalogue — libellé envoyé au filtre (`variants.color`) + hex affiché */
export const CATALOG_COLOR_PRESETS = [
    { name: 'Noir', hex: '#000000' },
    { name: 'Bleu', hex: '#0059DD' },
    { name: 'Blanc', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#BFBFBF' },
] as const;

export type CatalogColorPreset = (typeof CATALOG_COLOR_PRESETS)[number];

export const CUSTOM_COLOR_VALUE = '__custom__';

export function findPresetByName(name: string): CatalogColorPreset | undefined {
    const normalized = name.trim().toLowerCase();
    return CATALOG_COLOR_PRESETS.find((p) => p.name.toLowerCase() === normalized);
}

export function findPresetByHex(hex: string): CatalogColorPreset | undefined {
    const normalized = hex.trim().toLowerCase();
    return CATALOG_COLOR_PRESETS.find((p) => p.hex.toLowerCase() === normalized);
}
