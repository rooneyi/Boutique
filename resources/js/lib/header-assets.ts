import iconBell from '../../media/header-top/icon-bell.svg';
import iconGlobe from '../../media/header-top/icon-globe.svg';
import iconHeart from '../../media/header-top/icon-heart.svg';
import iconSearch from '../../media/header-top/icon-search.svg';
import iconUser from '../../media/header-top/icon-user.svg';
import socialFacebook from '../../media/header-top/social-facebook.svg';
import socialInstagram from '../../media/header-top/social-instagram.svg';
import socialTiktok from '../../media/header-top/social-tiktok.svg';
import headerCartIcon from '../../media/header-cart-icon.svg';

/** Assets header — Figma 122-2184 */
export const HEADER_ASSETS = {
    social: {
        instagram: socialInstagram,
        tiktok: socialTiktok,
        facebook: socialFacebook,
    },
    iconUser,
    iconGlobe,
    iconSearch,
    iconBell,
    iconHeart,
    iconCart: headerCartIcon,
} as const;

export const HEADER_SOCIAL_LINKS = [
    { href: 'https://www.instagram.com/pose_comme_jamais_?igsh=MTdybnIzOXVtOWZoNA==', label: 'Instagram', icon: HEADER_ASSETS.social.instagram },
    { href: 'https://vt.tiktok.com/ZSCTBoGmA/', label: 'TikTok', icon: HEADER_ASSETS.social.tiktok },
    { href: 'https://www.facebook.com/share/1BfxX4MEwy/?mibextid=wwXIfr', label: 'Facebook', icon: HEADER_ASSETS.social.facebook },
] as const;
