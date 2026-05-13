import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Doit être rendu à l'intérieur de l'arbre Inertia (layout ou page), pas dans `withApp`.
 */
export function FlashToaster() {
    const flash = usePage().props.flash as { success?: string; error?: string } | undefined;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error]);

    return null;
}
