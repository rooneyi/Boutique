/**
 * Charte admin — alignée sur la vitrine client (storefront-ui-styles).
 */
import {
    SF_BTN_PRIMARY,
    SF_CARD,
    SF_HERO_KICKER,
    SF_MUTED,
    SF_NAV_ITEM,
    SF_NAV_ITEM_ACTIVE,
    SF_SECTION_SUBTITLE,
    SF_SECTION_TITLE,
} from '@/lib/storefront-ui-styles';

export const ADMIN_KICKER = SF_HERO_KICKER;

export const ADMIN_PAGE_TITLE = SF_SECTION_TITLE;

export const ADMIN_PAGE_SUBTITLE = SF_SECTION_SUBTITLE;

export const ADMIN_MUTED = SF_MUTED;

export const ADMIN_H3 =
    'font-poppins text-xl font-semibold tracking-tight text-black sm:text-2xl lg:text-3xl';

export const ADMIN_H4 = 'font-poppins text-xs font-semibold text-[#747474] sm:text-sm';

/** Libellé secondaire visible uniquement sous le breakpoint table */
export const ADMIN_MOBILE_META = 'mt-0.5 block font-poppins text-xs font-normal text-[#8a8a8a] md:hidden';

export const ADMIN_PAGE_SECTION = 'space-y-6 sm:space-y-8 lg:space-y-10';

export const ADMIN_BTN_PRIMARY = SF_BTN_PRIMARY;

export const ADMIN_BTN_PILL_DARK =
    'font-poppins inline-flex w-full items-center justify-center gap-2 rounded-[32px] border border-black bg-black px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 sm:w-auto sm:px-[18px] sm:py-[15px] sm:text-[15px]';

export const ADMIN_BTN_PILL_OUTLINE =
    'font-poppins inline-flex w-full items-center justify-center gap-2 rounded-[32px] border border-black bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-neutral-100 sm:w-auto sm:px-[18px] sm:py-[15px] sm:text-[15px]';

/** Carte admin — écrase les styles shadcn (rounded-xl, ring, card-foreground). */
export const ADMIN_CARD =
    'rounded-sm border border-neutral-100 bg-white text-black shadow-sm !rounded-sm ring-0 !bg-white !text-black [&_[data-slot=card-description]]:font-poppins [&_[data-slot=card-description]]:text-base [&_[data-slot=card-description]]:text-[#747474]';

export const ADMIN_PAGE_BG = 'bg-[#f8f7f9]';

export const ADMIN_SHELL_MAX = 'mx-auto max-w-[1440px]';

export const ADMIN_NAV_ITEM = SF_NAV_ITEM;

export const ADMIN_NAV_ITEM_ACTIVE = SF_NAV_ITEM_ACTIVE;

export const ADMIN_SUBNAV_LINK =
    'font-poppins text-base font-normal text-black transition-colors hover:text-[#0059DD] border-b-2 border-transparent pb-0.5 data-[active=true]:border-[#0059DD] data-[active=true]:font-medium data-[active=true]:text-[#0059DD]';

export const ADMIN_FILTER_PILL =
    'font-poppins inline-flex items-center justify-center rounded-[32px] border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:border-black';

export const ADMIN_FILTER_PILL_ACTIVE =
    'font-poppins inline-flex items-center justify-center rounded-[32px] border border-black bg-black px-4 py-2.5 text-sm font-semibold text-white';

export const ADMIN_TABLE_WRAPPER =
    '-mx-4 overflow-x-auto rounded-sm border border-neutral-100 bg-white sm:mx-0 [scrollbar-width:thin]';

export const ADMIN_TABLE_MIN_WIDTH = 'min-w-[36rem]';

export const ADMIN_TABLE_INNER =
    'min-w-[36rem] [&_[data-slot=table-head]]:h-10 [&_[data-slot=table-head]]:px-3 [&_[data-slot=table-head]]:font-medium sm:[&_[data-slot=table-head]]:h-11 sm:[&_[data-slot=table-head]]:px-4 [&_[data-slot=table-head]]:text-[#8a8a8a] [&_[data-slot=table-cell]]:px-3 [&_[data-slot=table-cell]]:py-3 sm:[&_[data-slot=table-cell]]:px-4 sm:[&_[data-slot=table-cell]]:py-3.5 [&_[data-slot=table-row]]:border-neutral-100/80 [&_[data-slot=table-row]]:hover:bg-neutral-50/50';

/** Masquer une colonne sur mobile / tablette */
export const ADMIN_TABLE_COL_MD = 'hidden md:table-cell';

export const ADMIN_TABLE_COL_LG = 'hidden lg:table-cell';

export const ADMIN_TABLE_HEADER_ROW =
    'border-neutral-100/80 bg-[#fafafa] hover:bg-[#fafafa]';

export const ADMIN_TABLE_ROW = 'border-neutral-100/80 hover:bg-neutral-50/50';

export const ADMIN_TABLE_HEAD =
    'font-poppins text-xs font-medium uppercase tracking-wide text-[#8a8a8a]';

export const ADMIN_TABLE_CELL = 'font-poppins text-sm font-normal text-neutral-800';

/** Ligne de liste (dashboard, analytics) — bordure légère */
export const ADMIN_LIST_ROW =
    'rounded-sm border border-neutral-100 bg-[#fafafa]/80 p-3 sm:p-4';

/** Ligne dashboard / commandes — empilée sur mobile */
export const ADMIN_LIST_ROW_STACKED =
    'flex flex-col gap-2 rounded-sm border border-neutral-100 bg-[#fafafa]/80 p-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4 md:grid md:grid-cols-12 md:gap-3';

export const ADMIN_BADGE_BLUE =
    'font-poppins rounded-full border border-[#0059DD]/15 bg-[#0059DD]/10 px-2.5 py-0.5 text-xs font-medium text-[#0059DD]';

export const ADMIN_BADGE_DARK =
    'font-poppins rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600';

/** @deprecated Utiliser ADMIN_BTN_PILL_OUTLINE */
export const ADMIN_BTN_SECONDARY = ADMIN_BTN_PILL_OUTLINE;

/** @deprecated Sidebar retirée */
export const ADMIN_BTN_GHOST = ADMIN_NAV_ITEM;

/** @deprecated Sidebar retirée */
export const ADMIN_BTN_GHOST_ACTIVE = ADMIN_NAV_ITEM_ACTIVE;

/** @deprecated */
export const ADMIN_SIDEBAR_SECTION = ADMIN_H4;

/** @deprecated */
export const ADMIN_FILTER_TAB = ADMIN_FILTER_PILL;

/** @deprecated */
export const ADMIN_FILTER_TAB_ACTIVE = ADMIN_FILTER_PILL_ACTIVE;

/** @deprecated */
export const ADMIN_BADGE = ADMIN_BADGE_BLUE;
