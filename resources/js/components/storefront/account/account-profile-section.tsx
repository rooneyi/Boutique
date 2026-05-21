import { HOME_ASSETS } from '@/lib/home-assets';
import type { AccountPreview } from '@/components/storefront/account/account-types';

type Props = {
    account: AccountPreview;
    compact?: boolean;
};

export function AccountProfileSection({ account, compact = false }: Props) {
    const avatarSize = compact ? 'size-[120px]' : 'size-[159px]';
    const nameClass = compact
        ? 'font-poppins text-xl font-semibold text-black'
        : 'font-poppins text-2xl font-semibold text-black';
    const phoneClass = compact
        ? 'font-poppins text-base text-[#999]'
        : 'font-poppins text-xl text-[#999]';
    const statValueClass = compact
        ? 'font-poppins text-2xl font-semibold text-black'
        : 'font-poppins text-[32px] font-semibold text-black';
    const statLabelClass = compact
        ? 'font-poppins text-base text-[#999]'
        : 'font-poppins text-xl text-[#999]';

    return (
        <div className="flex flex-col items-center gap-1.5 px-2.5 py-4">
            <div className={`${avatarSize} overflow-hidden rounded-full bg-neutral-200`}>
                {account.avatar_url ? (
                    <img src={account.avatar_url} alt="" className="size-full object-cover" />
                ) : (
                    <img src={HOME_ASSETS.heroModel} alt="" className="size-full object-cover" />
                )}
            </div>
            <p className={nameClass}>{account.name}</p>
            <p className={phoneClass}>{account.phone}</p>

            <div className="mt-2 flex items-center justify-center">
                <div className="flex flex-col items-center px-3 py-2.5">
                    <p className={statValueClass}>{account.orders_count}</p>
                    <p className={statLabelClass}>Achat(s)</p>
                </div>
                <div className="mx-2 h-[90px] w-px bg-[#e0e0e0]" aria-hidden />
                <div className="flex flex-col items-center px-3 py-2.5">
                    <p className={statValueClass}>{account.tokens_count}</p>
                    <p className={statLabelClass}>Jeton(s)</p>
                </div>
            </div>
        </div>
    );
}
