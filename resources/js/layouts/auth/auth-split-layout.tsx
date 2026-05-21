import logoPcj from '../../../media/logo_pcj.png';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children }: AuthLayoutProps) {
    return (
        <div className="font-poppins grid min-h-dvh grid-cols-1 bg-white lg:grid-cols-2">
            <aside className="flex items-center justify-center bg-black px-12 py-20 max-lg:hidden lg:px-[145px] lg:py-[120px]">
                <img
                    src={logoPcj}
                    alt="POSE COMME JAMAIS"
                    width={386}
                    height={386}
                    className="w-full max-w-[min(386px,80%)] object-contain"
                />
            </aside>

            <main className="flex w-full flex-col items-center justify-center px-6 py-10 sm:px-10">
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
