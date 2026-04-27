import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LogOut, Store, Home, ShoppingBag, Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function CustomerLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <header className="border-b bg-background sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href={route('home')} className="font-bold text-xl">
                            👗 Boutique
                        </Link>

                        {/* Desktop Menu */}
                        <nav className="hidden md:flex items-center gap-8">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={route('customer.products.index')}>
                                    <Store className="mr-2 h-4 w-4" />
                                    Boutique
                                </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={route('customer.orders.index')}>
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Commandes
                                </Link>
                            </Button>
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm hidden sm:inline">
                                {auth.user?.name}
                            </span>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem disabled>
                                        {auth.user?.email}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('logout')} method="post">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Déconnexion
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button size="icon" variant="ghost" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/30 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid gap-4 md:grid-cols-3 text-center text-sm text-muted-foreground">
                        <div>
                            <p className="font-medium text-foreground mb-1">À propos</p>
                            <p>Boutique de vêtements en ligne</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground mb-1">Contact</p>
                            <p>support@boutique.com</p>
                        </div>
                        <div>
                            <p className="font-medium text-foreground mb-1">Légal</p>
                            <p>© 2025 Boutique. Tous droits réservés.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
