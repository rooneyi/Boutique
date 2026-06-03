import { Head, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeAbout } from '@/components/storefront/home/home-about';
import { HomeBenefits } from '@/components/storefront/home/home-benefits';
import { HomeBrandCta } from '@/components/storefront/home/home-brand-cta';
import { HomeCategories } from '@/components/storefront/home/home-categories';
import { HomeCurated } from '@/components/storefront/home/home-curated';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { HomeHero } from '@/components/storefront/home/home-hero';
import { HomeNouveautes } from '@/components/storefront/home/home-nouveautes';
import {
    HomeTestimonial,
    type HomeTestimonialItem,
} from '@/components/storefront/home/home-testimonial';

type FeaturedProduct = {
    id: number;
    name: string;
    price: number;
    image_path: string | null;
    vendor_shop: string;
    category: string;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
};

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    canRegister: boolean;
    featuredProducts: FeaturedProduct[];
    highlightCategories: { id: number; name: string; count: number }[];
    testimonials: HomeTestimonialItem[];
    auth?: {
        user?: AuthUser | null;
    };
};

export default function Welcome() {
    const { auth, canRegister, featuredProducts, testimonials } = usePage<PageProps>().props;
    const user = auth?.user;

    return (
        <>
            <Head title="PCJ · Pose Comme Jamais" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader user={user} canRegister={canRegister} activeNav="home" />
                <main>
                    <HomeHero />
                    <HomeCategories />
                    <HomeAbout />
                    <HomeNouveautes products={featuredProducts} />
                    <HomeTestimonial testimonials={testimonials} />
                    <HomeBenefits />
                    <HomeCurated />
                    <HomeBrandCta />
                </main>
                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
