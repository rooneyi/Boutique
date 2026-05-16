import logoPcj from '../../../media/logo_pcj.png';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({ children }: AuthLayoutProps) {
    return (
        <div className="font-poppins grid min-h-dvh lg:grid-cols-2">
            <div className="relative hidden items-center justify-center bg-black lg:flex">
                <img
                    src={logoPcj}
                    alt="POSE COMME JAMAIS"
                    className="h-auto w-64 max-w-[70%] object-contain"
                />
            </div>

            <div className="flex flex-col items-center justify-center bg-white px-6 py-10 sm:px-10">
                <div className="mb-8 flex justify-center lg:hidden">
                    <img
                        src={logoPcj}
                        alt="POSE COMME JAMAIS"
                        className="h-28 w-28 object-contain"
                    />
                </div>

                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
