import type { ComponentType, ReactNode } from 'react';
import PageTransitionLayout from '@/layouts/page-transition-layout';

/** Page sans layout parent (vitrine avec header intégré dans la page). */
export function storefrontLayout() {
    return PageTransitionLayout;
}

/** Enveloppe le contenu de page dans la transition, à l’intérieur du layout métier. */
export function withPageTransition(Layout: ComponentType<{ children: ReactNode }>) {
    return function LayoutWithTransition({ children }: { children: ReactNode }) {
        return (
            <Layout>
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
