import { Head, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { InfoPageContent } from '@/components/storefront/info/info-page-content';

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

const SECTIONS = [
    {
        title: 'Délai de retour',
        paragraphs: [
            'Vous disposez de 30 jours à compter de la réception de votre commande pour demander un retour ou un échange, sous réserve que les articles soient dans leur état d’origine (non portés, non lavés, étiquettes intactes).',
        ],
    },
    {
        title: 'Articles éligibles',
        paragraphs: [
            'Les vêtements et accessoires PCJ en parfait état peuvent être retournés. Les articles personnalisés, soldés ou en promotion finale peuvent faire l’objet de conditions particulières indiquées sur la fiche produit.',
            'Les sous-vêtements et articles d’hygiène ne sont pas éligibles au retour pour des raisons sanitaires, sauf défaut de fabrication.',
        ],
    },
    {
        title: 'Comment demander un remboursement',
        paragraphs: [
            'Contactez notre service client par WhatsApp ou email en indiquant votre numéro de commande, le motif du retour et les articles concernés.',
            'Après validation, nous vous communiquer les instructions pour le retour en boutique ou la collecte selon votre zone.',
        ],
    },
    {
        title: 'Remboursement',
        paragraphs: [
            'Une fois l’article reçu et contrôlé, le remboursement est effectué sous 7 à 14 jours ouvrés via le même moyen de paiement utilisé lors de la commande (Mobile Money, carte ou autre).',
            'Les frais de livraison initiaux ne sont pas remboursés, sauf en cas d’erreur de notre part ou de produit défectueux.',
        ],
    },
    {
        title: 'Échanges',
        paragraphs: [
            'Si vous souhaitez un autre taille ou modèle, indiquez-le lors de votre demande. Nous ferons notre possible pour procéder à un échange selon les stocks disponibles.',
        ],
    },
];

export default function RefundPolicy() {
    const { auth, canRegister } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Politique de remboursement · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />
                <main className="py-8 sm:py-10">
                    <InfoPageContent sections={SECTIONS} />
                </main>
                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
