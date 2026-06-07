import iconBell from '../../media/header-top/icon-bell.svg';
import iconGlobe from '../../media/header-top/icon-globe.svg';
import iconHeart from '../../media/header-top/icon-heart.svg';
import iconSearch from '../../media/header-top/icon-search.svg';
import iconUser from '../../media/header-top/icon-user.svg';
import socialInstagram from '../../media/header-top/social-instagram.svg';
import socialTiktok from '../../media/header-top/social-tiktok.svg';
import socialWhatsapp from '../../media/header-top/social-whatsapp.svg';
import headerCartIcon from '../../media/header-cart-icon.svg';

/** Assets header — Figma 122-2184 */
export const HEADER_ASSETS = {
    social: {
        instagram: socialInstagram,
        tiktok: socialTiktok,
        whatsapp: socialWhatsapp,
    },
    iconUser,
    iconGlobe,
    iconSearch,
    iconBell,
    iconHeart,
    iconCart: headerCartIcon,
} as const;

export const HEADER_SOCIAL_LINKS = [
    { href: 'https://instagram.com', label: 'Instagram', icon: HEADER_ASSETS.social.instagram },
    { href: 'https://www.tiktok.com', label: 'TikTok', icon: HEADER_ASSETS.social.tiktok },
    { href: 'https://wa.me/243991934590', label: 'WhatsApp', icon: HEADER_ASSETS.social.whatsapp },
] as const;
