import { Link } from '@inertiajs/react';
import { useRef } from 'react';
import { AccountGuestPanel } from '@/components/storefront/account/account-guest-panel';
import { HEADER_ASSETS, HEADER_SOCIAL_LINKS } from '@/lib/header-assets';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    isAdmin?: boolean;
    onAccountClick?: () => void;
    onAccountClose?: () => void;
    accountActive?: boolean;
    isLoggedIn?: boolean;
};

/** Barre noire — Figma header top banner (122:2114) */
export function HomeHeaderTopBar({
    isAdmin = false,
    onAccountClick,
    onAccountClose,
    accountActive = false,
    isLoggedIn = false,
}: Props) {
    const accountAnchorRef = useRef<HTMLDivElement>(null);
    const showGuestPanel = accountActive && !isLoggedIn;

    return (
        <div className="relative bg-black text-white">
            <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 py-[15px] sm:px-8 lg:px-[102px]">
                <div className="flex items-center gap-3">
                    {HEADER_SOCIAL_LINKS.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noreferrer"
                            className="block size-[28.564px] shrink-0 transition-opacity hover:opacity-90"
                            aria-label={social.label}
                        >
                            <img
                                src={social.icon}
                                alt=""
                                width={29}
                                height={29}
                                className="size-[28.564px]"
                            />
                        </a>
                    ))}
                    {isAdmin ? (
                        <span className="hidden font-poppins text-sm font-normal leading-normal text-white sm:inline">
                            Administration PCJ
                        </span>
                    ) : null}
                </div>

                <div className="flex items-center gap-[27px]">
                    {isAdmin ? (
                        <Link
                            href={route('home')}
                            className="font-poppins text-sm font-normal leading-normal text-white transition-opacity hover:opacity-80"
                        >
                            Voir la boutique
                        </Link>
                    ) : null}

                    {!isAdmin && onAccountClick ? (
                        <div ref={accountAnchorRef} className="relative">
                            <button
                                type="button"
                                onClick={onAccountClick}
                                className={cn(
                                    'flex items-center gap-2.5 transition-opacity hover:opacity-80',
                                    accountActive && 'opacity-100',
                                )}
                                aria-expanded={showGuestPanel}
                                aria-haspopup={!isLoggedIn ? 'dialog' : undefined}
                            >
                                <img
                                    src={HEADER_ASSETS.iconUser}
                                    alt=""
                                    width={24}
                                    height={24}
                                    className="size-6 shrink-0"
                                />
                                <span className="font-poppins text-sm font-normal leading-normal text-white">
                                    {isLoggedIn ? 'Mon compte' : 'Se connecter'}
                                </span>
                            </button>
                            {!isLoggedIn && onAccountClose && (
                                <AccountGuestPanel
                                    open={showGuestPanel}
                                    onClose={onAccountClose}
                                    anchorRef={accountAnchorRef}
                                />
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
