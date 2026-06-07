import { router } from '@inertiajs/react';
import {
    Gift,
    Headphones,
    LogOut,
    MapPin,
    Package,
    Settings,
} from 'lucide-react';
import { toast } from 'sonner';
import { AccountDrawerMenuItem } from '@/components/storefront/account/account-drawer-menu-item';
import { route } from '@/lib/route';

type Props = {
    onNavigate?: () => void;
    compact?: boolean;
};

export function AccountMenuNav({ onNavigate, compact = false }: Props) {
    function handlePlaceholder(label: string) {
        toast.message(`${label}`, {
            description: 'Cette section sera disponible prochainement.',
        });
    }

    const itemClass = compact ? '[&_span]:text-xl [&_svg]:size-7' : undefined;

    return (
        <nav className="overflow-hidden rounded-xl">
            <AccountDrawerMenuItem
                icon={Package}
                label="Mes commandes"
                href={route('customer.orders.index')}
                onClick={onNavigate}
                className={itemClass}
            />
            <AccountDrawerMenuItem
                icon={Gift}
                label="Mes coupons"
                onClick={() => handlePlaceholder('Mes coupons')}
                className={itemClass}
            />
            <AccountDrawerMenuItem
                icon={MapPin}
                label="Carnet d'adresses"
                onClick={() => handlePlaceholder("Carnet d'adresses")}
                className={itemClass}
            />
            <AccountDrawerMenuItem
                icon={Settings}
                label="Informations personnelles"
                href={route('profile.edit')}
                onClick={onNavigate}
                className={itemClass}
            />
            <AccountDrawerMenuItem
                icon={Headphones}
                label="Aides & Contact"
                href={route('contact')}
                onClick={onNavigate}
                className={itemClass}
            />
            <AccountDrawerMenuItem
                icon={LogOut}
                label="Déconnexion"
                href={route('logout')}
                method="post"
                onClick={onNavigate}
                className={itemClass}
            />
        </nav>
    );
}

export function AccountMenuNavGuest() {
    return (
        <div className="py-12 text-center">
            <p className="font-poppins text-xl text-[#737373]">
                Connectez-vous pour accéder à votre compte.
            </p>
            <button
                type="button"
                className="font-poppins mt-4 text-lg font-semibold text-[#0059DD] hover:underline"
                onClick={() => router.visit(route('login'))}
            >
                Se connecter
            </button>
        </div>
    );
}
