import { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    avatarUrl: string | null;
    initials: string;
    name: string;
    removeRequested?: boolean;
    onRemove?: () => void;
    onFileSelect?: () => void;
};

export function ProfileAvatarField({
    avatarUrl,
    initials,
    name,
    removeRequested = false,
    onRemove,
    onFileSelect,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const displayUrl = removeRequested ? null : preview ?? avatarUrl;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <div
                    className={cn(
                        'flex size-[159px] items-center justify-center overflow-hidden rounded-full bg-[#f0f0f0]',
                        !displayUrl && 'border border-[#e0e0e0]',
                    )}
                >
                    {displayUrl ? (
                        <img src={displayUrl} alt="" className="size-full object-cover" />
                    ) : (
                        <span className="font-poppins text-4xl font-semibold text-[#999]">
                            {initials}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="absolute right-1 bottom-1 flex size-10 items-center justify-center rounded-full border border-[#bfbfbf] bg-white shadow-sm transition-colors hover:bg-neutral-50"
                    aria-label="Changer la photo de profil"
                >
                    <Camera className="size-5 text-black" strokeWidth={1.25} />
                </button>

                {displayUrl ? (
                    <button
                        type="button"
                        onClick={() => {
                            setPreview(null);
                            if (inputRef.current) {
                                inputRef.current.value = '';
                            }
                            onRemove?.();
                        }}
                        className="absolute top-1 right-1 flex size-8 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black"
                        aria-label="Supprimer la photo"
                    >
                        <X className="size-4" strokeWidth={2} />
                    </button>
                ) : null}
            </div>

            <p className="font-poppins text-center text-sm text-[#737373]">
                Photo de {name.split(' ')[0] || 'profil'}
            </p>

            <input
                ref={inputRef}
                type="file"
                name="avatar"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                        return;
                    }
                    setPreview(URL.createObjectURL(file));
                    onFileSelect?.();
                }}
            />
        </div>
    );
}
