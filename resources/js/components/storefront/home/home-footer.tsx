import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { StorefrontLogo } from '@/components/storefront/storefront-logo';
import { CHECKOUT_PAYMENT_ASSETS } from '@/lib/home-assets';
import { HEADER_ASSETS } from '@/lib/header-assets';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
            <path d="M16.9 2h-3v12.2a2.5 2.5 0 1 1-2.1-2.5V8.6a5.6 5.6 0 1 0 5.1 5.6V8.2A8.4 8.4 0 0 0 22 9.9V6.8a5.4 5.4 0 0 1-5.1-4.8z" />
        </svg>
    );
}

function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

const FOOTER_SOCIAL = [
    { href: 'https://instagram.com', label: 'Instagram', Icon: InstagramIcon },
    { href: 'https://www.tiktok.com', label: 'TikTok', Icon: TikTokIcon },
    {
        href: 'https://wa.me/243991934590',
        label: 'WhatsApp',
        image: HEADER_ASSETS.social.whatsapp,
    },
] as const;

const FOOTER_NAV = [
    { label: 'Accueil', href: route('home') },
    { label: 'Collection', href: route('customer.products.index') },
    { label: 'A Propos', href: route('about') },
    { label: 'Contact', href: route('contact') },
] as const;

const FOOTER_INFO = ['Livraison', "Conditions d'utilisation", 'Politique de remboursement'] as const;

/** Ordre Figma footer 1440 */
const PAYMENT_METHODS = [
    { src: CHECKOUT_PAYMENT_ASSETS.airtel, alt: 'Airtel Money', size: 47 },
    { src: CHECKOUT_PAYMENT_ASSETS.orange, alt: 'Orange Money', size: 50 },
    { src: CHECKOUT_PAYMENT_ASSETS.card, alt: 'Carte bancaire', size: 50 },
    { src: CHECKOUT_PAYMENT_ASSETS.mpesa, alt: 'M-Pesa', size: 47 },
] as const;

const FOOTER_TITLE_CLASS = 'font-poppins text-xl font-semibold leading-normal text-white lg:text-2xl';

function FooterTitle({ children, className }: { children: ReactNode; className?: string }) {
    return <p className={cn(FOOTER_TITLE_CLASS, className)}>{children}</p>;
}

function BrandTagline() {
    return (
        <div className="space-y-0.5 font-poppins text-white">
            <p className="text-sm font-bold uppercase leading-snug sm:text-base lg:text-lg">
                Posé comme jamais
            </p>
            <p className="text-xs font-normal leading-snug text-white/90 sm:text-sm lg:text-base">
                Gardons notre attitude
            </p>
        </div>
    );
}

function BrandSocial() {
    return (
        <div className="flex items-center gap-2.5">
            {FOOTER_SOCIAL.map((social) => (
                <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/90 transition-colors hover:text-white"
                    aria-label={social.label}
                >
                    {'image' in social ? (
                        <img src={social.image} alt="" className="size-5" />
                    ) : (
                        <social.Icon className="size-5" />
                    )}
                </a>
            ))}
        </div>
    );
}

function BrandBlock({ logoSize }: { logoSize: number }) {
    return (
        <div className="flex flex-col gap-5">
            <StorefrontLogo variant="on-dark" href={route('home')} size={logoSize} />
            <BrandTagline />
            <BrandSocial />
        </div>
    );
}

function FooterColumn({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
    return (
        <div className={cn('flex shrink-0 flex-col gap-5', className)}>
            <FooterTitle>{title}</FooterTitle>
            {children}
        </div>
    );
}

function FooterNavLinks() {
    return (
        <nav className="flex flex-col gap-[13px] font-poppins text-[15px] font-normal leading-normal lg:text-[17px]">
            {FOOTER_NAV.map((item) =>
                item.href.includes('#') ? (
                    <a key={item.label} href={item.href} className="hover:opacity-80">
                        {item.label}
                    </a>
                ) : (
                    <Link key={item.label} href={item.href} className="hover:opacity-80">
                        {item.label}
                    </Link>
                ),
            )}
        </nav>
    );
}

function FooterInfoLinks() {
    return (
        <nav className="flex flex-col gap-[13px] font-poppins text-[15px] font-medium leading-normal lg:text-[17px]">
            {FOOTER_INFO.map((label) => (
                <span key={label}>{label}</span>
            ))}
        </nav>
    );
}

function FooterContactLinks() {
    return (
        <div className="flex flex-col gap-[13px] font-poppins text-[15px] font-medium leading-normal lg:text-[17px]">
            <a
                href="tel:+243123456789"
                className="flex items-center gap-2.5 whitespace-nowrap hover:opacity-80"
            >
                <img
                    src={HEADER_ASSETS.social.whatsapp}
                    alt=""
                    className="size-[23px] shrink-0"
                />
                +243 123 456 789
            </a>
            <a
                href="mailto:kambmusene@gmail.com"
                className="flex items-center gap-2.5 hover:opacity-80"
            >
                <MailFooterIcon className="size-5 shrink-0" />
                kambmusene@gmail.com
            </a>
        </div>
    );
}

function FooterPaymentIcons() {
    return (
        <div className="flex flex-nowrap items-center gap-2">
            {PAYMENT_METHODS.map((method) => (
                <img
                    key={method.alt}
                    src={method.src}
                    alt={method.alt}
                    width={method.size}
                    height={method.size}
                    className="shrink-0 rounded-full object-cover"
                    style={{ width: method.size, height: method.size }}
                />
            ))}
        </div>
    );
}

export function HomeFooter() {
    return (
        <footer className="bg-black text-white">
            <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-8 lg:pl-[46px] lg:pr-[92px] lg:pt-[60px] lg:pb-[100px]">
                {/* Mobile */}
                <div className="flex flex-col gap-10 lg:hidden">
                    <div className="flex items-start gap-8 sm:gap-12">
                        <div className="min-w-0 flex-1">
                            <BrandBlock logoSize={56} />
                        </div>
                        <FooterColumn title="NAVIGATION" className="gap-5">
                            <FooterNavLinks />
                        </FooterColumn>
                    </div>

                    <FooterColumn title="INFORMATION">
                        <FooterInfoLinks />
                    </FooterColumn>
                    <FooterColumn title="CONTACT">
                        <FooterContactLinks />
                    </FooterColumn>
                    <FooterColumn title="MODE DE PAIEMENT">
                        <FooterPaymentIcons />
                    </FooterColumn>
                </div>

                {/* Desktop — Figma 1440×329 */}
                <div className="hidden items-start justify-between gap-8 lg:flex xl:gap-10">
                    <div className="w-[min(100%,200px)] shrink-0">
                        <BrandBlock logoSize={72} />
                    </div>
                    <FooterColumn title="NAVIGATION">
                        <FooterNavLinks />
                    </FooterColumn>
                    <FooterColumn title="INFORMATION">
                        <FooterInfoLinks />
                    </FooterColumn>
                    <FooterColumn title="CONTACT">
                        <FooterContactLinks />
                    </FooterColumn>
                    <FooterColumn title="MODE DE PAIEMENT">
                        <FooterPaymentIcons />
                    </FooterColumn>
                </div>
            </div>
        </footer>
    );
}

function MailFooterIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.25" />
            <path d="m3 7 9 6 9-6" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
