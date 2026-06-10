import { CreditCard, ShieldCheck, Truck } from 'lucide-react';
import { useState } from 'react';
import { ProductReviewForm } from '@/components/storefront/product-review-form';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import { cn } from '@/lib/utils';

type ReviewRow = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    author: string;
};

type UserReview = {
    rating: number;
    comment: string | null;
    updated_at: string;
} | null;

const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'care', label: 'Guide de soins' },
    { id: 'reviews', label: 'Avis' },
] as const;

type TabId = (typeof TABS)[number]['id'];

type Props = {
    productId: number;
    description: string;
    canReview: boolean;
    userReview: UserReview;
    reviews: ReviewRow[];
};

const FEATURES = [
    {
        icon: ShieldCheck,
        title: 'Qualité premium',
        text: 'Matières sélectionnées et finitions soignées.',
    },
    {
        icon: Truck,
        title: 'Livraison rapide 2-3 jours',
        text: 'Expédition suivie dès validation de commande.',
    },
    {
        icon: CreditCard,
        title: 'Paiement sécurisé 100% Sécurisé',
        text: 'Transactions protégées et données chiffrées.',
    },
] as const;

export function ProductInfoSection({
    productId,
    description,
    canReview,
    userReview,
    reviews,
}: Props) {
    const [tab, setTab] = useState<TabId>('description');

    return (
        <section className="border-t border-neutral-200 px-4 py-12 sm:px-14">
            <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_280px]">
                <div>
                    <div className="flex flex-wrap gap-6 border-b border-neutral-200">
                        {TABS.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTab(t.id)}
                                className={cn(
                                    'pb-3 font-poppins text-lg font-medium transition-colors',
                                    tab === t.id
                                        ? 'border-b-2 border-[#0059DD] text-[#0059DD]'
                                        : 'text-[#747474] hover:text-[#0059DD]',
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 font-poppins text-sm leading-relaxed text-[#393939] md:text-base">
                        {tab === 'description' && (
                            <div className="space-y-4">
                                <p>{description || 'Aucune description disponible.'}</p>
                                <ul className="list-disc space-y-2 pl-5">
                                    <li>Coupe oversize confortable</li>
                                    <li>100% coton premium</li>
                                    <li>Fabriqué avec soin</li>
                                </ul>
                            </div>
                        )}
                        {tab === 'care' && (
                            <ul className="list-disc space-y-2 pl-5">
                                <li>Lavage à 30°C</li>
                                <li>Ne pas utiliser de javel</li>
                                <li>Repassage à basse température</li>
                                <li>Ne pas sécher en machine</li>
                            </ul>
                        )}
                        {tab === 'reviews' && (
                            <div className="space-y-8">
                                <ProductReviewForm
                                    productId={productId}
                                    canReview={canReview}
                                    userReview={userReview}
                                />
                                {reviews.length === 0 ? (
                                    <p className="text-[#747474]">
                                        Aucun avis publié pour le moment.
                                    </p>
                                ) : (
                                    <ul className="space-y-4">
                                        {reviews.map((r) => (
                                            <li
                                                key={r.id}
                                                className="rounded-lg border border-neutral-200 p-4"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <span className="font-semibold text-black">
                                                        {r.author}
                                                    </span>
                                                    <span className="text-xs text-[#747474]">
                                                        {new Date(
                                                            r.created_at,
                                                        ).toLocaleDateString('fr-FR')}
                                                    </span>
                                                </div>
                                                <StarRatingDisplay
                                                    value={r.rating}
                                                    size="sm"
                                                />
                                                {r.comment ? (
                                                    <p className="mt-2 text-[#747474]">
                                                        {r.comment}
                                                    </p>
                                                ) : null}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-8">
                    {FEATURES.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex gap-4">
                            <Icon
                                className="size-10 shrink-0 text-black"
                                strokeWidth={1.25}
                            />
                            <div>
                                <p className="font-poppins text-lg font-semibold text-black">
                                    {title}
                                </p>
                                <p className="mt-1 font-poppins text-sm text-[#747474]">
                                    {text}
                                </p>
                            </div>
                        </div>
                    ))}
                </aside>
            </div>
        </section>
    );
}
