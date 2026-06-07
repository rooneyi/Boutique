import { Link } from '@inertiajs/react';
import { HEADER_ASSETS, HEADER_SOCIAL_LINKS } from '@/lib/header-assets';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    isAdmin?: boolean;
    canRegister?: boolean;
    isGuest?: boolean;
    accountHref?: string;
};

/** Barre noire — Figma header top banner (122:2114) */
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

                    {!isAdmin && (canRegister && isGuest ? (
                        <Link
                            href={route('auth.customer.register')}
                            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                        >
                            <img
                                src={HEADER_ASSETS.iconUser}
                                alt=""
                                width={24}
                                height={24}
                                className="size-6 shrink-0"
                            />
                            <span className="font-poppins text-sm font-normal leading-normal text-white">
                                Rejoignez-nous
                            </span>
                        </Link>
                    ) : !isAdmin && !isGuest ? (
                        <Link
                            href={accountHref}
                            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                        >
                            <img
                                src={HEADER_ASSETS.iconUser}
                                alt=""
                                width={24}
                                height={24}
                                className="size-6 shrink-0"
                            />
                            <span className="font-poppins text-sm font-normal leading-normal text-white">
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
                        <img
                            src={HEADER_ASSETS.iconGlobe}
                            alt=""
                            width={24}
                            height={24}
                            className="size-6 shrink-0"
                        />
                        <span className="font-poppins text-sm font-normal leading-normal text-white">
                            Lubumbashi
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
