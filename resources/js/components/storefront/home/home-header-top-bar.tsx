import { Link } from '@inertiajs/react';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

const SOCIAL_LINKS = [
    { href: 'https://instagram.com', label: 'Instagram', icon: 'instagram' },
    { href: 'https://www.tiktok.com', label: 'TikTok', icon: 'tiktok' },
    { href: 'https://pinterest.com', label: 'Pinterest', icon: 'pinterest' },
    { href: 'https://wa.me/243991934590', label: 'WhatsApp', icon: 'whatsapp' },
] as const;

type Props = {
    isAdmin?: boolean;
    canRegister?: boolean;
    isGuest?: boolean;
    accountHref?: string;
};

/** Barre noire au-dessus du header — Figma top banner (122:2114) */
export function HomeHeaderTopBar({
    isAdmin = false,
    canRegister = false,
    isGuest = true,
    accountHref = route('login'),
}: Props) {
    return (
        <div className="bg-black text-white">
            <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 py-[15px] sm:px-8 lg:px-[102px]">
                <div className="flex items-center gap-3">
                    {SOCIAL_LINKS.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            className="block size-[28.564px] shrink-0 transition-opacity hover:opacity-90"
                            aria-label={social.label}
                        >
                            <TopBarSocialIcon name={social.icon} />
                        </a>
                    ))}
                    {isAdmin ? (
                        <span className="hidden font-poppins text-[14px] font-normal leading-normal text-white sm:inline">
                            Administration PCJ
                        </span>
                    ) : null}
                </div>

                <div className="flex items-center gap-[27px]">
                    {isAdmin ? (
                        <Link
                            href={route('home')}
                            className="font-poppins text-[14px] font-normal leading-normal text-white transition-opacity hover:opacity-80"
                        >
                            Voir la boutique
                        </Link>
                    ) : null}

                    {!isAdmin && (canRegister && isGuest ? (
                        <Link
                            href={route('auth.customer.register')}
                            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                        >
                            <TopBarUserIcon />
                            <span className="font-poppins text-[14px] font-normal leading-normal text-white">
                                Rejoignez-nous
                            </span>
                        </Link>
                    ) : !isAdmin && !isGuest ? (
                        <Link
                            href={accountHref}
                            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                        >
                            <TopBarUserIcon />
                            <span className="font-poppins text-[14px] font-normal leading-normal text-white">
                                Mon compte
                            </span>
                        </Link>
                    ) : null)}

                    <div
                        className={cn(
                            'flex items-center gap-2.5',
                            isAdmin && 'hidden sm:flex',
                        )}
                    >
                        <TopBarGlobeIcon />
                        <span className="font-poppins text-[14px] font-normal leading-normal text-white">
                            Lubumbashi
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TopBarSocialIcon({ name }: { name: (typeof SOCIAL_LINKS)[number]['icon'] }) {
    return (
        <svg
            viewBox="0 0 29 29"
            fill="none"
            className="size-[28.564px]"
            aria-hidden
        >
            <circle cx="14.5" cy="14.5" r="13.75" stroke="white" strokeWidth="0.75" />
            <g fill="white" transform="translate(7 7)">
                {name === 'instagram' && (
                    <>
                        <rect x="1.5" y="1.5" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1" fill="none" />
                        <circle cx="7.5" cy="7.5" r="3" stroke="white" strokeWidth="1" fill="none" />
                        <circle cx="11.5" cy="3.5" r="0.75" fill="white" />
                    </>
                )}
                {name === 'tiktok' && (
                    <path d="M10.5 2.5v7.2a2.2 2.2 0 1 1-1.8-2.2V5.2a4.9 4.9 0 1 0 4.5 4.5V6.2A7.3 7.3 0 0 0 14 7.8V5.5a4.7 4.7 0 0 1-3.5-3z" />
                )}
                {name === 'pinterest' && (
                    <path d="M7.5 1.2a6.3 6.3 0 0 0-2.3 12.2c0-.5 0-1.2.1-1.8l.7-2.9s-.2-.4-.2-1c0-.9.5-1.5 1.1-1.5.6 0 .8.4.8 1 0 .6-.4 1.5-.6 2.3-.1.6.3 1.1 1 1.1 1.1 0 2-1.2 2-2.9 0-1.5-1-2.5-2.6-2.5-1.8 0-2.9 1.4-2.9 2.8 0 .6.2 1.1.5 1.4.1.1.1.1.1.2l-.2.8c0 .1-.1.2-.2.1-.9-.4-1.4-1.5-1.4-2.5 0-2 1.4-3.8 4.1-3.8 2.2 0 3.9 1.6 3.9 3.7 0 2.2-1.4 4-3.3 4-.6 0-1.3-.4-1.4-.8l-.4 1.5c-.1.6-.5 1.3-.7 1.6.5.2 1.1.3 1.8.3A6.3 6.3 0 0 0 7.5 1.2z" />
                )}
                {name === 'whatsapp' && (
                    <path d="M12.2 1.6A6.8 6.8 0 0 0 3.5 10.4L2.5 13.5l3.2-.7a6.8 6.8 0 0 0 6.5-11.2Zm-4.6 9.3a5.6 5.6 0 0 1-2.9-.8l-.2-.1-1.9.4.4-1.8-.1-.2a5.6 5.6 0 1 1 4.9 2.5Zm3.2-4.2c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4.1-.2 0-.7-.2-1.3-.8-.5-.4-.8-.9-.8-1.1-.1-.2 0-.2.1-.4 0 0 .2-.2.2-.3 0-.1.1-.2.2-.3 0-.1.1-.2 0-.3 0-.1-.4-1-1-1.4-.2-.4-.3-.3-.4-.3h-.4c-.1 0-.3.1-.4.2-.2.2-.6.6-.6 1.4s.6 1.7.7 1.8c.1.1 1.2 1.8 2.9 2.5 1.7.7 1.7.5 2 .5.3 0 1.1-.5 1.3-1 .2-.5.2-.9.1-1 0 0-.2-.1-.4-.2z" />
                )}
            </g>
        </svg>
    );
}

function TopBarUserIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0" aria-hidden>
            <path
                d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TopBarGlobeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0" aria-hidden>
            <path
                d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.6 9h16.8M3.6 15h16.8M12 3c-2.2 2.4-3.3 5.1-3.3 9s1.1 6.6 3.3 9M12 3c2.2 2.4 3.3 5.1 3.3 9s-1.1 6.6-3.3 9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
