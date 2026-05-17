/**
 * Charte admin — alignée sur docs/STYLE-VENDOR-FRONT.md et l'espace vendeur (#0059DD, Poppins).
 */
import { VENDOR_BADGE, VENDOR_BTN_PRIMARY, VENDOR_H3, VENDOR_H4, VENDOR_MUTED } from '@/lib/vendor-ui-styles';

/** Titre de page admin (lisible, pas le H1 86px vitrine/vendeur). */
export const ADMIN_PAGE_TITLE =
    'font-poppins text-[clamp(1.75rem,4vw,2.25rem)] font-bold leading-tight tracking-tight text-black';

export const ADMIN_H3 = VENDOR_H3;
export const ADMIN_H4 = VENDOR_H4;
export const ADMIN_MUTED = VENDOR_MUTED;
export const ADMIN_BADGE = VENDOR_BADGE;
export const ADMIN_BTN_PRIMARY = VENDOR_BTN_PRIMARY;

/** Cartes admin : fond clair + texte noir (évite text-card-foreground blanc en dark mode). */
export const ADMIN_CARD =
    'rounded-sm border border-neutral-200 bg-white text-black shadow-sm [&_[data-slot=card-description]]:text-[#747474]';

export const ADMIN_BTN_SECONDARY =
    'font-poppins inline-flex items-center justify-center gap-2 rounded-sm border border-neutral-300 bg-white px-5 py-2.5 text-lg font-semibold text-black transition-colors hover:border-[#0059DD] hover:text-[#0059DD] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0059DD]';

export const ADMIN_BTN_GHOST =
    'font-poppins inline-flex w-full items-center justify-start gap-2 rounded-sm px-3 py-2 text-base font-normal text-black transition-colors hover:bg-neutral-100 hover:text-[#0059DD]';

export const ADMIN_BTN_GHOST_ACTIVE =
    'font-poppins inline-flex w-full items-center justify-start gap-2 rounded-sm border-l-[3px] border-[#0059DD] bg-[#0059DD]/5 px-3 py-2 text-base font-semibold text-[#0059DD]';

export const ADMIN_SIDEBAR_SECTION =
    'font-poppins px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#747474]';

export const ADMIN_FILTER_TAB =
    'font-poppins inline-flex items-center justify-center rounded-sm border border-neutral-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:border-[#0059DD] hover:text-[#0059DD]';

export const ADMIN_FILTER_TAB_ACTIVE =
    'font-poppins inline-flex items-center justify-center rounded-sm border border-[#0059DD] bg-[#0059DD] px-4 py-2 text-sm font-semibold text-white';

export const ADMIN_TABLE_HEAD =
    'font-poppins text-sm font-semibold text-[#747474]';

export const ADMIN_TABLE_CELL = 'font-poppins text-sm text-black';
