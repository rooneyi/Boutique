import { Head, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeCurated } from '@/components/storefront/home/home-curated';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { ProductBreadcrumbs } from '@/components/storefront/product/product-breadcrumbs';
import { ProductGallery } from '@/components/storefront/product/product-gallery';
import { ProductInfoSection } from '@/components/storefront/product/product-info-section';
import { ProductPurchasePanel } from '@/components/storefront/product/product-purchase-panel';
import { ProductWearSection } from '@/components/storefront/product/product-wear-section';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image_path?: string | null;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
    vendor: {
        id: number;
        shop_name: string;
    };
};

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

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    product: Product;
    category_name?: string;
    reviews: ReviewRow[];
    user_review: UserReview;
    can_review: boolean;
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function ProductDetail() {
    const {
        auth,
        canRegister,
        product,
        reviews,
        user_review,
        can_review,
    } = usePage<PageProps>().props;

    const images = product.image_path
        ? Array.from({ length: 5 }, () => product.image_path as string)
        : [];

    return (
        <>
            <Head title={`${product.name} · PCJ`} />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader
                    user={auth?.user}
                    canRegister={canRegister}
                    activeNav="collection"
                />

                <main>
                    <ProductBreadcrumbs productName={product.name} />

                    <section className="px-4 pb-12 sm:px-14">
                        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:gap-7">
                            <div className="min-w-0 flex-1">
                                <ProductGallery images={images} alt={product.name} />
                            </div>
                            <ProductPurchasePanel product={product} />
                        </div>
                    </section>

                    <ProductInfoSection
                        productId={product.id}
                        description={product.description}
                        canReview={can_review}
                        userReview={user_review}
                        reviews={reviews}
                    />

                    <ProductWearSection />
                    <HomeCurated />
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
