import { Button } from '@/components/ui/button';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { destroy as deleteFavorite, store as postFavorite } from '@/routes/customer/favorites';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    auth?: {
        user?: AuthUser | null;
    };
};

type Props = {
    productId: number;
    favorited: boolean;
    variant?: 'icon' | 'outline';
    className?: string;
};

export function FavoriteButton({ productId, favorited, variant = 'icon', className }: Props) {
    const { auth } = usePage<PageProps>().props;
    const favoritesDrawer = useOptionalFavoritesDrawer();

    function syncFavorites() {
        router.reload({ only: ['favoritesCount'] });
        void favoritesDrawer?.refresh();
    }

    function toggle(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!auth?.user) {
            toast.info('Connectez-vous pour enregistrer des favoris.', {
                action: {
                    label: 'Connexion',
                    onClick: () => router.visit(route('login')),
                },
            });
            return;
        }
        if (auth.user.role !== 'CUSTOMER') {
            toast.message('Compte client requis', {
                description: 'Les favoris sont disponibles pour les comptes clients.',
            });
            return;
        }

        if (favorited) {
            router.delete(deleteFavorite.url(productId), {
                preserveScroll: true,
                onSuccess: syncFavorites,
            });
        } else {
            router.post(postFavorite.url(productId), {}, {
                preserveScroll: true,
                onSuccess: () => {
                    syncFavorites();
                    favoritesDrawer?.openFavorites();
                },
            });
        }
    }

    const icon = (
        <Heart
            className={cn(
                'h-5 w-5 transition-colors',
                favorited ? 'fill-black text-black' : 'text-[#747474]',
            )}
            aria-hidden
        />
    );

    if (variant === 'outline') {
        return (
            <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn('gap-2 rounded-sm font-poppins', className)}
                onClick={toggle}
            >
                {icon}
                {favorited ? 'Retirer des favoris' : 'Favoris'}
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('rounded-sm', className)}
            onClick={toggle}
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
            {icon}
        </Button>
    );
}
