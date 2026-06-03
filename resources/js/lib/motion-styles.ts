/** Durées et courbes partagées — synchronisées avec app.css */
export const MOTION_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const MOTION_DURATION = {
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500',
} as const;

/** Entrée de page Inertia */
export const MOTION_PAGE_ENTER = 'motion-page-enter';

/** Carte produit — léger soulèvement au survol (voir .motion-card-lift en CSS) */
export const MOTION_CARD_LIFT = 'motion-card-lift';

/** Grille collection */
export const MOTION_COLLECTION_GRID = 'collection-product-grid';

/** Carrousel horizontal produits */
export const MOTION_PRODUCT_TRACK = 'product-card-track';

/** Boutons et liens interactifs */
export const MOTION_INTERACTIVE =
    'transition-[color,background-color,border-color,opacity,transform] duration-300 ease-out';

/** Liste en cascade (délai via style inline) */
export const MOTION_STAGGER_ITEM = 'motion-stagger-item';

/** Contenu qui apparaît (filtres, témoignages…) */
export const MOTION_FADE_UP = 'motion-fade-up';

/** Panneau Radix / overlay */
export const MOTION_OVERLAY =
    'duration-300 ease-out data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0';
