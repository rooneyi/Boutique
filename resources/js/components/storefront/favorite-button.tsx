import { Button } from '@/components/ui/button';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
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
    /** Ne pas ouvrir le tiroir après ajout (ex. carte déjà dans le tiroir). */
    openDrawerOnAdd?: boolean;
};

const FAVORITE_RELOAD_PROPS = [
    'favoritesCount',
    'featuredProducts',
    'products',
    'product',
] as const;

export function FavoriteButton({
    productId,
    favorited,
    variant = 'icon',
    className,
    openDrawerOnAdd = true,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const favoritesDrawer = useOptionalFavoritesDrawer();
    const [liked, setLiked] = useState(favorited);

    useEffect(() => {
        setLiked(favorited);
    }, [favorited]);

    function syncFavorites() {
        router.reload({
            only: [...FAVORITE_RELOAD_PROPS],
            preserveScroll: true,
        });
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

        const nextLiked = !liked;
        setLiked(nextLiked);

        if (liked) {
            router.delete(deleteFavorite.url(productId), {
                preserveScroll: true,
                onSuccess: syncFavorites,
                onError: () => {
                    setLiked(true);
                    toast.error('Impossible de retirer des favoris.');
                },
            });
        } else {
            router.post(
                postFavorite.url(productId),
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        syncFavorites();
                        toast.success('Ajouté aux favoris.');
                        if (openDrawerOnAdd) {
                            favoritesDrawer?.openFavorites();
                        }
                    },
                    onError: () => {
                        setLiked(false);
                        toast.error('Impossible d’ajouter aux favoris.');
                    },
                },
            );
        }
    }

    const icon = (
        <Heart
            className={cn(
                'h-5 w-5 transition-colors',
                liked ? 'fill-black text-black' : 'text-[#747474]',
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
                {liked ? 'Retirer des favoris' : 'Favoris'}
            </Button>
        );
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('relative z-20 rounded-sm', className)}
            onClick={toggle}
            aria-label={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={liked}
        >
            {icon}
        </Button>
    );
}
