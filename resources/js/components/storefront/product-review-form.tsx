import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { store as postProductReview } from '@/routes/customer/products/reviews';
import { SF_BTN_PRIMARY } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type UserReview = {
    rating: number;
    comment: string | null;
    updated_at: string;
} | null;

type Props = {
    productId: number;
    canReview: boolean;
    userReview: UserReview;
};

export function ProductReviewForm({ productId, canReview, userReview }: Props) {
    const [rating, setRating] = useState(userReview?.rating ?? 0);
    const [comment, setComment] = useState(userReview?.comment ?? '');
    const [submitting, setSubmitting] = useState(false);

    if (!canReview) {
        return (
            <p className="font-poppins text-sm text-[#747474]">
                Les avis sont réservés aux clients ayant commandé ce produit.
            </p>
        );
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            return;
        }
        setSubmitting(true);
        router.post(
            postProductReview.url(productId),
            { rating, comment: comment.trim() || null },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
            },
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4 rounded-sm border border-neutral-200 bg-neutral-50 p-4">
            <p className="font-poppins text-sm font-semibold text-black">{userReview ? 'Modifier votre avis' : 'Laisser un avis'}</p>
            <div className="space-y-2">
                <Label className="font-poppins">Note (obligatoire)</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            className="rounded-sm p-1 transition-transform hover:scale-105"
                            onClick={() => setRating(n)}
                            aria-label={`${n} sur 5`}
                        >
                            <Star className={cn('h-8 w-8', n <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300')} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="review-comment" className="font-poppins">
                    Commentaire (optionnel)
                </Label>
                <Textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    className="rounded-sm font-poppins"
                    placeholder="Partagez votre expérience…"
                />
            </div>
            <Button type="submit" disabled={submitting || rating < 1} className={cn(SF_BTN_PRIMARY)}>
                {userReview ? 'Mettre à jour' : 'Publier mon avis'}
            </Button>
        </form>
    );
}
