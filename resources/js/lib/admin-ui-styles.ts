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
    SF_PILL_BTN_DARK,
    SF_SECTION_SUBTITLE,
    SF_SECTION_TITLE,
} from '@/lib/storefront-ui-styles';

export const ADMIN_KICKER = SF_HERO_KICKER;

export const ADMIN_PAGE_TITLE = SF_SECTION_TITLE;

export const ADMIN_PAGE_SUBTITLE = SF_SECTION_SUBTITLE;

export const ADMIN_MUTED = SF_MUTED;

export const ADMIN_H3 =
    'font-poppins text-2xl font-semibold tracking-tight text-black md:text-[36px]';

export const ADMIN_H4 = 'font-poppins text-sm font-semibold text-[#747474]';

export const ADMIN_BTN_PRIMARY = SF_BTN_PRIMARY;

export const ADMIN_BTN_PILL_DARK = SF_PILL_BTN_DARK;

export const ADMIN_BTN_PILL_OUTLINE =
    'font-poppins inline-flex items-center justify-center gap-2 rounded-[32px] border border-black bg-white px-[18px] py-[15px] text-[15px] font-semibold text-black transition-colors hover:bg-neutral-100';

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
    'overflow-x-auto rounded-sm border border-neutral-100 bg-white';

export const ADMIN_TABLE_INNER =
    '[&_[data-slot=table-head]]:h-11 [&_[data-slot=table-head]]:px-4 [&_[data-slot=table-head]]:font-medium [&_[data-slot=table-head]]:text-[#8a8a8a] [&_[data-slot=table-cell]]:px-4 [&_[data-slot=table-cell]]:py-3.5 [&_[data-slot=table-row]]:border-neutral-100/80 [&_[data-slot=table-row]]:hover:bg-neutral-50/50';

export const ADMIN_TABLE_HEADER_ROW =
    'border-neutral-100/80 bg-[#fafafa] hover:bg-[#fafafa]';

export const ADMIN_TABLE_ROW = 'border-neutral-100/80 hover:bg-neutral-50/50';

export const ADMIN_TABLE_HEAD =
    'font-poppins text-xs font-medium uppercase tracking-wide text-[#8a8a8a]';

export const ADMIN_TABLE_CELL = 'font-poppins text-sm font-normal text-neutral-800';

/** Ligne de liste (dashboard, analytics) — bordure légère */
export const ADMIN_LIST_ROW =
    'rounded-sm border border-neutral-100 bg-[#fafafa]/80 p-4';

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
