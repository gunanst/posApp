'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    HomeIcon,
    LayoutGridIcon,
    PackageIcon,
    ShoppingCartIcon,
    LogOutIcon,
    UserIcon,
    ClockIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen flex bg-muted/10 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside
                className={`
                    fixed z-50 top-0 left-0 w-64 min-h-screen bg-white dark:bg-gray-900 border-r shadow-lg
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:flex-shrink-0
                `}
            >
                <div className="flex flex-col h-full overflow-auto">
                    {/* Logo & Close button (mobile) */}
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <span className="text-2xl font-bold text-primary">MyPOS</span>
                        <button
                            onClick={closeSidebar}
                            className="md:hidden cursor-pointer"
                        >
                            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 text-sm">
                        <SidebarLink
                            href="/dashboard"
                            icon={<HomeIcon className="w-5 h-5" />}
                            onClick={closeSidebar}
                            isActive={pathname === '/dashboard'}
                        >
                            Dashboard
                        </SidebarLink>
                        <SidebarLink
                            href="/dashboard/products"
                            icon={<PackageIcon className="w-5 h-5" />}
                            onClick={closeSidebar}
                            isActive={pathname === '/dashboard/products'}
                        >
                            Products
                        </SidebarLink>
                        <SidebarLink
                            href="/dashboard/categories"
                            icon={<LayoutGridIcon className="w-5 h-5" />}
                            onClick={closeSidebar}
                            isActive={pathname === '/dashboard/categories'}
                        >
                            Categories
                        </SidebarLink>
                        <SidebarLink
                            href="/dashboard/transaction"
                            icon={<ShoppingCartIcon className="w-5 h-5" />}
                            onClick={closeSidebar}
                            isActive={pathname === '/dashboard/transaction'}
                        >
                            Transactions
                        </SidebarLink>
                        <SidebarLink
                            href="/dashboard/history"
                            icon={<ClockIcon className="w-5 h-5" />}
                            onClick={closeSidebar}
                            isActive={pathname === '/dashboard/history'}
                        >
                            History
                        </SidebarLink>
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
            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="
                        fixed inset-0 bg-black/40 z-40
                        transition-opacity duration-300 md:hidden
                    "
                />
            )}

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-h-screen">

                {/* Header */}
                <header className="flex items-center justify-between bg-white dark:bg-gray-900 border-b px-6 py-4 md:px-6">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden cursor-pointer"
                        >
                            <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
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
    onClick,
    isActive = false,
}: {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                flex items-center px-4 py-2 rounded-lg transition-colors
                ${isActive
                    ? 'bg-primary/20 text-primary border-r-2 border-primary'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary'
                }
            `}
        >
            <span className="mr-3">{icon}</span>
            <span>{children}</span>
        </Link>
    );
}