'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    HomeIcon,
    LayoutGridIcon,
    PackageIcon,
    ShoppingCartIcon,
    LogOutIcon,
    UserIcon,
    ClockIcon, // Ganti icon history
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-muted/10 text-gray-900 dark:text-gray-100">

            {/* Mobile Sidebar Toggle */}
            <input type="checkbox" id="sidebar-toggle" className="hidden peer" />

            {/* Sidebar */}
            <aside
                className="
                    fixed z-50 top-0 left-0 w-64 min-h-screen bg-white dark:bg-gray-900 border-r shadow-lg
                    transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out
                    md:translate-x-0 md:static md:flex-shrink-0
                "
            >
                <div className="flex flex-col h-full overflow-auto">
                    {/* Logo & Close button (mobile) */}
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <span className="text-2xl font-bold text-primary">MyPOS</span>
                        <label htmlFor="sidebar-toggle" className="md:hidden cursor-pointer">
                            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </label>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 text-sm">
                        <SidebarLink href="/dashboard" icon={<HomeIcon className="w-5 h-5" />}>Dashboard</SidebarLink>
                        <SidebarLink href="/dashboard/products" icon={<PackageIcon className="w-5 h-5" />}>Products</SidebarLink>
                        <SidebarLink href="/dashboard/categories" icon={<LayoutGridIcon className="w-5 h-5" />}>Categories</SidebarLink>
                        <SidebarLink href="/dashboard/transaction" icon={<ShoppingCartIcon className="w-5 h-5" />}>Transactions</SidebarLink>
                        <SidebarLink href="/dashboard/history" icon={<ClockIcon className="w-5 h-5" />}>History</SidebarLink>
                    </nav>

                    {/* Optional bottom section (e.g., logout) */}
                    <div className="border-t px-4 py-4">
                        <Button variant="ghost" className="w-full flex justify-start space-x-2 text-red-500">
                            <LogOutIcon className="w-4 h-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Overlay for Mobile */}
            <label htmlFor="sidebar-toggle" className="
                fixed inset-0 bg-black/40 z-40 opacity-0 pointer-events-none
                peer-checked:opacity-100 peer-checked:pointer-events-auto
                transition-opacity duration-300 md:hidden
            " />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-h-screen">

                {/* Header */}
                <header className="flex items-center justify-between bg-white dark:bg-gray-900 border-b px-6 py-4 md:px-6">
                    <div className="flex items-center space-x-3">
                        <label htmlFor="sidebar-toggle" className="md:hidden cursor-pointer">
                            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>Profile</span>
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 bg-muted/10">
                    <Card className="p-4 md:p-6 shadow-sm">{children}</Card>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900 border-t px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} MyPOS. All rights reserved.
                </footer>
            </div>
        </div>
    );
}

// Sidebar Link Item
function SidebarLink({
    href,
    icon,
    children,
}: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <Link href={href} className="
            flex items-center px-4 py-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20
            text-gray-700 dark:text-gray-200 hover:text-primary transition-colors
        ">
            <span className="mr-3">{icon}</span>
            <span>{children}</span>
        </Link>
    );
}
