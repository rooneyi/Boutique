/**
 * Classes Tailwind alignées sur docs/STYLE-VENDOR-FRONT.md (espace vendeur uniquement).
 */
export const VENDOR_H1 =
    'font-poppins text-[clamp(2.25rem,6.5vw,5.375rem)] font-black leading-[1.05] tracking-tight text-black';

/** H2 : provisoire (52 px) — charte initiale non précisée */
export const VENDOR_H2 = 'font-poppins text-[52px] font-semibold leading-tight tracking-tight text-black';

export const VENDOR_H3 = 'font-poppins text-[36px] font-semibold leading-tight tracking-tight text-black';

export const VENDOR_H4 = 'font-poppins text-[20px] font-semibold leading-snug text-[#747474]';

/** Liens Accueil, Collection, À propos, Contact — 16 px regular */
export const VENDOR_NAV_LINK =
    'font-poppins text-base font-normal text-black transition-colors hover:text-[#0059DD] data-[active=true]:text-[#0059DD]';

/** Sous-navigation espace métier (même style que liens vitrine) */
export const VENDOR_SUBNAV_LINK =
    'font-poppins text-base font-normal text-black transition-colors hover:text-[#0059DD] border-b-2 border-transparent pb-0.5 data-[active=true]:border-[#0059DD] data-[active=true]:text-[#0059DD]';

/** Bouton primaire — 18 px ; angles peu arrondis */
export const VENDOR_BTN_PRIMARY =
    'font-poppins inline-flex items-center justify-center gap-2 rounded-sm bg-[#0059DD] px-5 py-2.5 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-[#0047b0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0059DD]';

/** Texte secondaire courant */
export const VENDOR_MUTED = 'font-poppins text-base font-normal text-[#747474]';

/** Carte vendeur — angles peu arrondis (pas de XL) */
export const VENDOR_CARD =
    'rounded-sm border border-neutral-200 bg-white shadow-sm';

/** Pastilles / badges vendeur — léger arrondi uniquement */
export const VENDOR_BADGE =
    'rounded-sm border-0 font-poppins';
