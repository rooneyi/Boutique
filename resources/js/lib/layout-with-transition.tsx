import type { ComponentType, ReactNode } from 'react';
import PageTransitionLayout from '@/layouts/page-transition-layout';

/** Vitrine — pas d’animation sur toute la page (évite que le header « bouge » à chaque navigation). */
function StorefrontPageLayout({ children }: { children: ReactNode }) {
    return children;
}

/** Page sans layout parent (vitrine avec header intégré dans la page). */
export function storefrontLayout() {
    return StorefrontPageLayout;
}

/** Enveloppe le contenu de page dans la transition, à l’intérieur du layout métier. */
export function withPageTransition<P extends { children?: ReactNode }>(
    Layout: ComponentType<P>,
) {
    return function LayoutWithTransition(props: P) {
        const { children, ...layoutProps } = props;

        return (
            <Layout {...(layoutProps as P)}>
                <PageTransitionLayout>{children}</PageTransitionLayout>
            </Layout>
        );
    };
}

/** Plusieurs layouts : le plus externe en premier, transition en dernier (près de la page). */
export function withPageTransitionStack(
    ...layouts: ComponentType<{ children: ReactNode }>[]
) {
    return [...layouts, PageTransitionLayout];
}
