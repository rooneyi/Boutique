import { FlashToaster } from '@/components/flash-toaster';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import type { AuthLayoutProps } from '@/types';

export default function AuthLayout({
    title = '',
    description = '',
    variant = 'simple',
    children,
}: AuthLayoutProps) {
    const Layout =
        variant === 'split' ? AuthSplitLayout : AuthSimpleLayout;

    return (
        <Layout title={title} description={description}>
            {children}
            <FlashToaster />
        </Layout>
    );
}
