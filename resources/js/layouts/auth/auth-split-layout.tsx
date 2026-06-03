import logoPcj from '../../../media/logo_pcj.png';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children }: AuthLayoutProps) {
    return (
        <div className="font-poppins grid min-h-dvh grid-cols-1 bg-white lg:grid-cols-2">
            <aside className="relative flex min-h-[280px] items-center justify-center bg-black px-8 py-16 lg:min-h-dvh lg:px-[145px] lg:py-[120px]">
                <img
                    src={logoPcj}
                    alt="POSE COMME JAMAIS"
                    width={386}
                    height={386}
                    className="w-full max-w-[min(386px,72vw)] object-contain lg:max-w-[386px]"
                />
            </aside>

            <main className="flex min-h-dvh w-full flex-col items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
                <div className="mb-8 flex justify-center lg:hidden">
                    <img
                        src={logoPcj}
                        alt="POSE COMME JAMAIS"
                        width={128}
                        height={128}
                        className="size-28 object-contain sm:size-32"
                    />
                </div>

                <div className="w-full max-w-[400px]">{children}</div>
            </main>
        </div>
    );
}
