import collectionHero from '../../media/collection-hero.jpg';
import wearLook1 from '../../media/wear-look-1.jpg';
import wearLook2 from '../../media/wear-look-2.jpg';
import aboutModels from '../../media/about-models.jpg';
import brandCta from '../../media/brand-cta.jpg';
import categoryCap from '../../media/casquette/category-cap.jpeg';
import categoryPack from '../../media/tshirt/category-pack.jpeg';
import categoryTshirt from '../../media/tshirt/category-tshirt.jpeg';
import heroModel from '../../media/hero-model.png';
import logoPcj from '../../media/logo_pcj.png';
import logoPcjNoir from '../../media/logo_pcj_noir.png';
import paymentAirtel from '../../media/payment-airtel.png';
import paymentCard from '../../media/payment-card.png';
import paymentMpesa from '../../media/payment-mpesa.png';
import paymentOrange from '../../media/payment-orange.png';
import selectionManifeste from '../../media/selection-manifeste.jpg';
import testimonialImage from '../../media/testimonial.jpg';

/** Logo blanc — fonds sombres (footer, panneau auth noir) */
export const HOME_ASSETS = {
    logo: logoPcj,
    /** Logo noir — navbar blanche (Figma « pcj noir ») */
    logoDark: logoPcjNoir,
    collectionHero,
    heroModel,
    categoryPack,
    categoryTshirt,
    categoryCap,
    aboutModels,
    testimonial: testimonialImage,
    selectionManifeste,
    brandCta,
    wearLook1,
    wearLook2,
} as const;

export const CHECKOUT_PAYMENT_ASSETS = {
    airtel: paymentAirtel,
    orange: paymentOrange,
    mpesa: paymentMpesa,
    card: paymentCard,
} as const;
