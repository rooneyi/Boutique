import { Button } from '@/components/ui/button';
import { useOptionalAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { useStorefrontAuth } from '@/hooks/use-storefront-auth';
import { router } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { destroy as deleteFavorite, store as postFavorite } from '@/routes/customer/favorites';
import { SF_FAVORITE_RED, SF_FAVORITE_RED_FILL } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    productId: number;
    favorited: boolean;
    variant?: 'icon' | 'outline' | 'showcase';
    className?: string;
    /** Ne pas ouvrir le tiroir après ajout (ex. carte déjà dans le tiroir). */
    openDrawerOnAdd?: boolean;
};

const FAVORITE_RELOAD_PROPS = [
    'favoritesCount',
    'featuredProducts',
    'products',
    'product',
    'lines',
    'suggestedProducts',
] as const;

export function FavoriteButton({
    productId,
    favorited,
    variant = 'icon',
    className,
    openDrawerOnAdd = true,
}: Props) {
    const user = useStorefrontAuth();
    const favoritesDrawer = useOptionalFavoritesDrawer();
    const accountDrawer = useOptionalAccountDrawer();
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

        if (!user) {
            accountDrawer?.openAccount();
            return;
        }
        if (user.role !== 'CUSTOMER') {
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
                'transition-colors',
                variant === 'showcase' ? 'size-7' : 'size-5',
                variant === 'showcase' || variant === 'icon'
                    ? liked
                        ? SF_FAVORITE_RED_FILL
                        : SF_FAVORITE_RED
                    : liked
                      ? SF_FAVORITE_RED_FILL
                      : 'text-[#747474]',
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

    if (variant === 'showcase') {
        return (
            <button
                type="button"
                className={cn(
                    'relative z-20 flex size-full items-center justify-center',
                    className,
                )}
                onClick={toggle}
                aria-label={liked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                aria-pressed={liked}
            >
                {icon}
            </button>
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
