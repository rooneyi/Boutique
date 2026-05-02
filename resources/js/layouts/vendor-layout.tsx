import { ReactNode } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { Package, ShoppingCart, Settings, LogOut, BarChart3, Menu } from 'lucide-react';
import { useState } from 'react';
import { route } from '@/lib/route';

export default function VendorLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="hidden w-64 border-r bg-background md:block">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="border-b px-6 py-4">
                        <Link href={route('vendor.dashboard')} className="font-bold text-lg">
                            📦 Ma Boutique
                        </Link>
                    </div>

                    {/* Menu */}
                    <nav className="flex-1 space-y-2 px-4 py-6">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                        >
                            <Link href={route('vendor.dashboard')}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Tableau de Bord
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                        >
                            <Link href={route('vendor.products.index')}>
                                <Package className="mr-2 h-4 w-4" />
                                Produits
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            asChild
                        >
                            <Link href={route('vendor.orders.index')}>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Commandes
                            </Link>
                        </Button>

                        <div className="border-t pt-4">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={route('profile.edit')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Paramètres
                                </Link>
                            </Button>
                        </div>
                    </nav>

                    {/* User */}
                    <div className="border-t px-4 py-4">
                        <p className="text-sm font-medium truncate">{auth.user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            {auth.user?.email}
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="border-b bg-background px-6 py-4 flex items-center justify-between md:border-0">
                    <div className="flex items-center gap-4">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="md:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                {auth.user?.name}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('profile.edit')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Paramètres
                                </Link>
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
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto px-6 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
