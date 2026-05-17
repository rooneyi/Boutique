import { SF_HERO_KICKER } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    description?: string;
    actions?: React.ReactNode;
};

/** Bandeau type collection — même esprit que la vitrine client. */
export function AdminPageHero({ title, description, actions }: Props) {
    return (
        <section className="mb-10">
            <div className="flex min-h-[min(280px,45vh)] flex-col overflow-hidden rounded-sm lg:flex-row lg:items-stretch">
                <div className="relative flex flex-1 items-end justify-center bg-[#c07f12] px-6 py-10 lg:max-w-[38%]">
                    <p className="font-poppins text-center text-[clamp(1.5rem,4vw,2.5rem)] font-black uppercase leading-tight tracking-tight text-white">
                        PCJ
                        <br />
                        Admin
                    </p>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-4 bg-[#292d32] px-8 py-10 lg:px-12">
                    <p className={SF_HERO_KICKER}>Administration</p>
                    <h1 className="font-poppins text-[clamp(1.75rem,4vw,3rem)] font-black uppercase leading-tight tracking-tight text-white">
                        {title}
                    </h1>
                    {description ? (
                        <p className="max-w-xl font-poppins text-base text-white/90 md:text-lg">
                            {description}
                        </p>
                    ) : null}
                    {actions ? <div className="flex flex-wrap gap-3 pt-2">{actions}</div> : null}
                </div>
            </div>
        </section>
    );
}

export function AdminPageHeroActions({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn('flex flex-wrap gap-3', className)}>{children}</div>;
}
