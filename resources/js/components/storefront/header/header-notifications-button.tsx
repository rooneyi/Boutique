import {
    HeaderIconPill,
    SF_HEADER_ICON_IMG_ACTIVE,
    SF_HEADER_ICON_PILL_BELL,
} from '@/components/storefront/header/header-icon-pill';
import { HEADER_ASSETS } from '@/lib/header-assets';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    active?: boolean;
    onClick?: () => void;
};

export function HeaderNotificationsButton({
    className,
    active = false,
    onClick,
}: Props) {
    return (
        <HeaderIconPill
            aria-label="Notifications"
            className={cn(SF_HEADER_ICON_PILL_BELL, className)}
            active={active}
            onClick={onClick}
        >
            <img
                src={HEADER_ASSETS.iconBell}
                alt=""
                width={17}
                height={20}
                className={cn(
                    'h-[19.5px] w-[16.514px] object-contain transition-[filter] duration-200',
                    active && SF_HEADER_ICON_IMG_ACTIVE,
                )}
            />
        </HeaderIconPill>
    );
}
