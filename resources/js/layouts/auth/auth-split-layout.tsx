import logoPcj from '../../../media/logo_pcj.png';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children }: AuthLayoutProps) {
    return (
        <div className="font-poppins flex min-h-dvh bg-white">
            <aside className="hidden w-1/2 shrink-0 items-center justify-center bg-black px-12 py-20 lg:flex xl:px-[145px] xl:py-[120px]">
                <img
                    src={logoPcj}
                    alt="POSE COMME JAMAIS"
                    className="size-[min(386px,70vw)] object-contain"
                />
            </aside>

            <main className="flex w-full flex-1 flex-col items-center justify-center px-6 py-10 sm:px-10">
                <div className="mb-10 flex justify-center lg:hidden">
                    <img
                        src={logoPcj}
                        alt="POSE COMME JAMAIS"
                        className="size-32 object-contain"
                    />
                </div>

                <div className="w-full max-w-[380px]">{children}</div>
            </main>
        </div>
    );
}
