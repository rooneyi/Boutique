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

export const ADMIN_CARD =
    `${SF_CARD} text-black ring-0 [&_[data-slot=card-description]]:text-[#747474]`;

export const ADMIN_PAGE_BG = 'bg-[#f0f0f0]';

export const ADMIN_SHELL_MAX = 'mx-auto max-w-[1440px]';

export const ADMIN_NAV_ITEM = SF_NAV_ITEM;

export const ADMIN_NAV_ITEM_ACTIVE = SF_NAV_ITEM_ACTIVE;

export const ADMIN_SUBNAV_LINK =
    'font-poppins text-base font-normal text-black transition-colors hover:text-[#0059DD] border-b-2 border-transparent pb-0.5 data-[active=true]:border-[#0059DD] data-[active=true]:font-medium data-[active=true]:text-[#0059DD]';

export const ADMIN_FILTER_PILL =
    'font-poppins inline-flex items-center justify-center rounded-[32px] border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:border-black';

export const ADMIN_FILTER_PILL_ACTIVE =
    'font-poppins inline-flex items-center justify-center rounded-[32px] border border-black bg-black px-4 py-2.5 text-sm font-semibold text-white';

export const ADMIN_TABLE_HEAD =
    'font-poppins text-sm font-semibold text-[#747474]';

export const ADMIN_TABLE_CELL = 'font-poppins text-sm text-black';

export const ADMIN_BADGE_BLUE =
    'font-poppins rounded-full border-0 bg-[#0059DD] px-3 py-1 text-sm font-medium text-white';

export const ADMIN_BADGE_DARK =
    'font-poppins rounded-full border-0 bg-black px-3 py-1 text-sm font-medium text-white';

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
