import {
    Headphones,
    LogIn,
    LogOut,
    MapPin,
    Package,
    Settings,
    UserPlus,
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

type GuestProps = {
    canRegister?: boolean;
    onNavigate?: () => void;
    compact?: boolean;
};

export function AccountMenuNavGuest({ canRegister = false, onNavigate, compact = false }: GuestProps) {
    const itemClass = compact ? 'px-4 py-3.5 [&_svg]:size-6 [&_span>span]:text-base' : undefined;

    return (
        <nav className="overflow-hidden rounded-xl">
            <AccountDrawerMenuItem
                icon={LogIn}
                label="Se connecter"
                href={route('login')}
                onClick={onNavigate}
                className={itemClass}
            />
            {canRegister ? (
                <AccountDrawerMenuItem
                    icon={UserPlus}
                    label="Créer un compte"
                    href={route('auth.customer.register')}
                    onClick={onNavigate}
                    className={itemClass}
                />
            ) : null}
            <AccountDrawerMenuItem
                icon={Headphones}
                label="Aides & Contact"
                href={route('contact')}
                onClick={onNavigate}
                className={itemClass}
            />
        </nav>
    );
}
