import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { CHECKOUT_PAYMENT_ASSETS, HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
            <path d="M16.9 2h-3v12.2a2.5 2.5 0 1 1-2.1-2.5V8.6a5.6 5.6 0 1 0 5.1 5.6V8.2A8.4 8.4 0 0 0 22 9.9V6.8a5.4 5.4 0 0 1-5.1-4.8z" />
        </svg>
    );
}

function PinterestIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
            <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.9.2-2.8l1.1-4.6s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.6-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4-4.2-4-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.4l-.3 1.2c-.1.2-.2.3-.4.2-1.4-.6-2.3-2.4-2.3-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.4-5.3 6.4-1 0-2-.6-2.3-1.3l-.6 2.3c-.2.9-.8 2-1.2 2.6.9.3 1.8.4 2.8.4A10 10 0 0 0 12 2z" />
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
    { href: 'https://pinterest.com', label: 'Pinterest', Icon: PinterestIcon },
] as const;

const FOOTER_NAV = [
    { label: 'Accueil', href: route('home') },
    { label: 'Catalogue', href: route('customer.products.index') },
    { label: 'A Propos', href: route('about') },
    { label: 'Contact', href: route('contact') },
] as const;

const FOOTER_INFO = ['Livraison', "Conditions d'utilisation", 'Politique de remboursement'] as const;

const PAYMENT_METHODS = [
    { src: CHECKOUT_PAYMENT_ASSETS.card, alt: 'Carte bancaire', size: 50 },
    { src: CHECKOUT_PAYMENT_ASSETS.orange, alt: 'Orange Money', size: 50 },
    { src: CHECKOUT_PAYMENT_ASSETS.airtel, alt: 'Airtel Money', size: 47 },
    { src: CHECKOUT_PAYMENT_ASSETS.mpesa, alt: 'M-Pesa', size: 47 },
] as const;

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="flex shrink-0 flex-col gap-5">
            <p className="font-poppins text-2xl font-semibold leading-normal text-white">{title}</p>
            {children}
        </div>
    );
}

export function HomeFooter() {
    return (
        <footer className="bg-black text-white">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-14 sm:px-8 lg:flex-row lg:flex-nowrap lg:items-start lg:gap-10 lg:pl-[46px] lg:pr-[92px] lg:pt-[60px] lg:pb-[100px]">
                <div className="flex shrink-0 flex-col gap-5">
                    <img
                        src={HOME_ASSETS.logo}
                        alt="PCJ"
                        width={150}
                        height={150}
                        className="size-[150px] object-contain"
                    />
                    <div className="font-poppins text-white">
                        <p className="text-[28px] font-bold uppercase leading-normal">
                            Posé comme jamais
                        </p>
                        <p className="text-xl font-normal leading-normal">Gardons notre attitude</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {FOOTER_SOCIAL.map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-white/90 transition-colors hover:text-white"
                                aria-label={label}
                            >
                                <Icon className="size-[28.564px]" />
                            </a>
                        ))}
                    </div>
                </div>

                <FooterColumn title="NAVIGATION">
                    <nav className="flex flex-col gap-[13px] font-poppins text-[17px] font-normal leading-normal">
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
                </FooterColumn>

                <FooterColumn title="INFORMATION">
                    <nav className="flex flex-col gap-[13px] font-poppins text-[17px] font-medium leading-normal">
                        {FOOTER_INFO.map((label) => (
                            <span key={label}>{label}</span>
                        ))}
                    </nav>
                </FooterColumn>

                <FooterColumn title="CONTACT">
                    <div className="flex flex-col gap-[13px] font-poppins text-[17px] font-medium leading-normal">
                        <a
                            href="tel:+243123456789"
                            className="flex items-center gap-2.5 whitespace-nowrap hover:opacity-80"
                        >
                            <PhoneFooterIcon className="size-[23px] shrink-0" />
                            +243 123 456 789
                        </a>
                        <a
                            href="mailto:kambmusene@gmail.com"
                            className="flex items-end gap-2 hover:opacity-80"
                        >
                            <MailFooterIcon className="size-5 shrink-0" />
                            kambmusene@gmail.com
                        </a>
                    </div>
                </FooterColumn>

                <FooterColumn title="MODE DE PAIEMENT">
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
                </FooterColumn>
            </div>
        </footer>
    );
}

function PhoneFooterIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden>
            <path
                d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
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
