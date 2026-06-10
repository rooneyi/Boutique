import { Head, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { ContactForm } from '@/components/storefront/contact/contact-form';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    canRegister: boolean;
    subjects: Record<string, string>;
    auth?: { user?: AuthUser | null };
    flash?: { success?: string };
};

export default function Contact() {
    const { auth, canRegister, subjects, flash } = usePage<PageProps>().props;
    const user = auth?.user;

    return (
        <>
            <Head title="Contact · PCJ" />

            <div className="min-h-screen bg-[#f8f7f9] font-poppins text-black antialiased">
                <HomeHeader
                    user={user}
                    canRegister={canRegister}
                    activeNav="contact"
                />
                <main>
                    <ContactForm
                        subjects={subjects}
                        success={flash?.success}
                        defaultName={user?.name}
                        defaultEmail={user?.email}
                    />
                </main>
                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
