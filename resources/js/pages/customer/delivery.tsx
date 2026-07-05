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
        title: 'Modes de livraison',
        paragraphs: [
            'PCJ propose deux options au moment de la commande : la livraison à domicile dans Lubumbashi et le retrait en boutique.',
            'Pour la livraison à domicile, indiquez une adresse complète, votre ville ou commune et votre quartier. Pour le retrait, présentez-vous en boutique avec votre numéro de commande et une pièce d’identité.',
        ],
    },
    {
        title: 'Délais de traitement',
        paragraphs: [
            'Après confirmation de votre commande, notre équipe prépare votre colis sous 24 à 48 heures ouvrées.',
            'La livraison à domicile est généralement effectuée sous 2 à 5 jours ouvrés selon votre zone. Le retrait en boutique est disponible dès que la commande est prête — nous vous contactons par WhatsApp.',
        ],
    },
    {
        title: 'Frais de livraison',
        paragraphs: [
            'Les frais de livraison sont indiqués lors du passage de commande. Certaines promotions peuvent inclure la livraison offerte sur les commandes éligibles.',
            'Le retrait en boutique est gratuit.',
        ],
    },
    {
        title: 'Suivi de commande',
        paragraphs: [
            'Vous recevez une confirmation par email et pouvez suivre le statut de votre commande depuis votre espace client « Mes commandes ».',
            'Pour toute question sur une livraison en cours, contactez-nous par WhatsApp ou via le formulaire de contact.',
        ],
    },
];

export default function Delivery() {
    const { auth, canRegister } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Livraison · PCJ" />

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
