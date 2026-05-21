import { Link } from '@inertiajs/react';
import { Instagram, Mail, Phone } from 'lucide-react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';

export function HomeFooter() {
    return (
        <footer className="bg-black text-white">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-14 sm:gap-12 sm:px-8 md:flex-row md:flex-wrap md:justify-between lg:px-[92px] lg:pb-24 lg:pt-16">
                <div className="max-w-xs space-y-5">
                    <img
                        src={HOME_ASSETS.logo}
                        alt="PCJ"
                        className="size-28 object-contain"
                    />
                    <p className="font-poppins text-base font-medium leading-normal">
                        Posé comme jamais
                        <br />
                        Gardons notre attitude
                    </p>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-white/90 hover:text-white"
                        aria-label="Instagram"
                    >
                        <Instagram className="size-7" />
                    </a>
                </div>

                <div className="space-y-4">
                    <p className="font-poppins text-xl font-medium">NAVIGATION</p>
                    <nav className="flex flex-col gap-2.5 font-poppins text-base font-medium">
                        <Link href={route('home')} className="hover:opacity-80">
                            Accueil
                        </Link>
                        <Link
                            href={route('customer.products.index')}
                            className="hover:opacity-80"
                        >
                            Catalogue
                        </Link>
                        <a href="#pourquoi-nous" className="hover:opacity-80">
                            a propos
                        </a>
                        <Link href={route('contact')} className="hover:opacity-80">
                            Contact
                        </Link>
                    </nav>
                </div>

                <div className="space-y-4">
                    <p className="font-poppins text-xl font-medium">INFORMATION</p>
                    <nav className="flex flex-col gap-2.5 font-poppins text-base font-medium">
                        <span>Livraison</span>
                        <span>condition d&apos;utilisation</span>
                        <span>Politique de confidentialité</span>
                    </nav>
                </div>

                <div className="space-y-4">
                    <p className="font-poppins text-xl font-medium">CONTACT</p>
                    <div className="flex flex-col gap-3 font-poppins text-base font-medium">
                        <a
                            href="tel:+243991934590"
                            className="flex items-center gap-3 hover:opacity-80"
                        >
                            <Phone className="size-5 shrink-0" />
                            243 991 934 590
                        </a>
                        <a
                            href="mailto:kambmusene@gmail.com"
                            className="flex items-center gap-3 hover:opacity-80"
                        >
                            <Mail className="size-5 shrink-0" />
                            kambmusene@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
