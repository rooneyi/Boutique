import { Head, usePage } from '@inertiajs/react';
import { AboutHero } from '@/components/storefront/about/about-hero';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeAbout } from '@/components/storefront/home/home-about';
import { HomeBenefits } from '@/components/storefront/home/home-benefits';
import { HomeBrandCta } from '@/components/storefront/home/home-brand-cta';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function About() {
    const { auth, canRegister } = usePage<PageProps>().props;

    return (
        <>
            <Head title="À Propos · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader
                    user={auth?.user}
                    canRegister={canRegister}
                    activeNav="about"
                />
                <main>
                    <AboutHero />
                    <HomeAbout />
                    <HomeBenefits />
                    <HomeBrandCta />
                </main>
                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
