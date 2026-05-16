import { Upload } from 'lucide-react';
import { HOME_ASSETS } from '@/lib/home-assets';

export function ProductWearSection() {
    return (
        <section className="px-4 py-12 sm:px-14">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-4">
                <h2 className="font-poppins text-2xl font-bold text-black md:text-3xl">
                    Comment les autres le portent
                </h2>
                <button
                    type="button"
                    className="flex items-center gap-2 font-poppins text-sm font-semibold uppercase tracking-wide text-black"
                >
                    <Upload className="size-5" />
                    Téléverser le vôtre
                </button>
            </div>
            <div className="mx-auto mt-8 grid max-w-[1440px] gap-4 sm:grid-cols-2">
                <img
                    src={HOME_ASSETS.wearLook1}
                    alt=""
                    className="aspect-square w-full rounded-lg object-cover"
                />
                <img
                    src={HOME_ASSETS.wearLook2}
                    alt=""
                    className="aspect-square w-full rounded-lg object-cover"
                />
            </div>
        </section>
    );
}
