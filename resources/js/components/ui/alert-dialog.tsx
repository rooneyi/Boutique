import * as React from 'react';

import { buttonVariants } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function AlertDialog(props: React.ComponentProps<typeof Dialog>) {
    return <Dialog {...props} />;
}

function AlertDialogContent(props: React.ComponentProps<typeof DialogContent>) {
    return <DialogContent {...props} />;
}

function AlertDialogHeader(props: React.ComponentProps<typeof DialogHeader>) {
    return <DialogHeader {...props} />;
}

function AlertDialogFooter(props: React.ComponentProps<typeof DialogFooter>) {
    return <DialogFooter {...props} />;
}

function AlertDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
    return <DialogTitle {...props} />;
}

function AlertDialogDescription(props: React.ComponentProps<typeof DialogDescription>) {
    return <DialogDescription {...props} />;
}

function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof DialogClose>) {
    return (
        <DialogClose
            className={cn(buttonVariants(), className)}
            {...props}
        />
    );
}

function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof DialogClose>) {
    return (
        <DialogClose
            className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
            {...props}
        />
    );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
};
