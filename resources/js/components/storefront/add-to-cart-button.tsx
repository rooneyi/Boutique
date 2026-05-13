import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { store as postCartItem } from '@/routes/customer/cart/items';
import { toast } from 'sonner';
import { route } from '@/lib/route';
import { SF_BTN_PRIMARY } from '@/lib/storefront-ui-styles';
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
    quantity?: number;
    disabled?: boolean;
    className?: string;
    label?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
};

export function AddToCartButton({
    productId,
    quantity = 1,
    disabled,
    className,
    label = 'Ajouter au panier',
    size = 'default',
}: Props) {
    const { auth } = usePage<PageProps>().props;

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        if (!auth?.user) {
            toast.info('Connectez-vous pour ajouter des articles au panier.', {
                action: {
                    label: 'Connexion',
                    onClick: () => router.visit(route('login')),
                },
            });
            return;
        }
        if (auth.user.role !== 'CUSTOMER') {
            toast.message('Compte client requis', {
                description: 'Les achats en ligne sont réservés aux comptes clients.',
            });
            return;
        }
        if (disabled) {
            return;
        }

        router.post(
            postCartItem.url(),
            { product_id: productId, quantity },
            {
                preserveScroll: true,
                onError: (errors) => {
                    const first =
                        (typeof errors.quantity === 'string' && errors.quantity) ||
                        (typeof errors.product_id === 'string' && errors.product_id) ||
                        Object.values(errors).find((v) => typeof v === 'string');
                    if (first) {
                        toast.error(first as string);
                    }
                },
            },
        );
    }

    return (
        <Button type="button" size={size} className={cn(SF_BTN_PRIMARY, className)} disabled={disabled} onClick={handleClick}>
            <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />
            {label}
        </Button>
    );
}
