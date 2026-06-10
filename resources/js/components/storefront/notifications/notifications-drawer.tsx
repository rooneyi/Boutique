import { Bell, X } from 'lucide-react';
import { useNotificationsDrawer } from '@/components/storefront/notifications/notifications-drawer-context';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';

export function NotificationsDrawer() {
    const { open, closeNotifications } = useNotificationsDrawer();

    return (
        <Sheet open={open} onOpenChange={(next) => !next && closeNotifications()}>
            <SheetContent
                side="right"
                size="wide"
                showCloseButton={false}
                className="flex flex-col overflow-hidden border-0 bg-white p-0"
                overlayClassName="bg-black/60 backdrop-blur-[2px]"
            >
                <div className="relative shrink-0 px-5 pt-10">
                    <SheetTitle className="font-poppins text-[36px] font-semibold leading-normal text-black">
                        Notifications
                    </SheetTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-[52px] right-[30px] size-10 rounded-full text-black hover:bg-neutral-100"
                        onClick={closeNotifications}
                        aria-label="Fermer les notifications"
                    >
                        <X className="size-10" strokeWidth={1.25} />
                    </Button>
                </div>

                <SheetDescription className="sr-only">
                    Vos notifications PCJ
                </SheetDescription>

                <div className="flex flex-1 flex-col items-center justify-center px-5 pb-16 text-center">
                    <Bell
                        className="mb-4 size-12 text-[#0059DD]"
                        strokeWidth={1.25}
                        aria-hidden
                    />
                    <p className="font-poppins text-lg font-medium text-black">
                        Aucune notification
                    </p>
                    <p className="mt-2 max-w-sm font-poppins text-sm text-[#737373]">
                        Vous serez informé ici des mises à jour de vos commandes
                        et des nouveautés PCJ.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
