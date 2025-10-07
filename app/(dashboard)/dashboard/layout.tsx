'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    HomeIcon,
    LayoutGridIcon,
    PackageIcon,
    ShoppingCartIcon,
    LogOutIcon,
    UserIcon,
    ClockIcon,
    BarChart3Icon,
    SettingsIcon,
    MenuIcon,
    XIcon,
    ScanBarcodeIcon,
    Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: <HomeIcon className="w-5 h-5" />,
            current: pathname === '/dashboard',
            badge: null
        },
        {
            name: 'Products',
            href: '/dashboard/products',
            icon: <PackageIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/products',
            badge: null
        },
        {
            name: 'Categories',
            href: '/dashboard/categories',
            icon: <LayoutGridIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/categories',
            badge: null
        },
        {
            name: 'POS',
            href: '/dashboard/transaction',
            icon: <ShoppingCartIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/transaction',
            badge: 'Live'
        },
        {
            name: 'History',
            href: '/dashboard/history',
            icon: <ClockIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/history',
            badge: null
        },
        {
            name: 'Reports',
            href: '/dashboard/reports',
            icon: <BarChart3Icon className="w-5 h-5" />,
            current: pathname === '/dashboard/reports',
            badge: 'New'
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: <SettingsIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/settings',
            badge: null
        }
    ];

    // Get current page title
    const getPageTitle = () => {
        const currentNav = navigation.find(item => item.current);
        return currentNav?.name || 'Dashboard';
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed z-50 top-0 left-0 w-80 min-h-screen bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 shadow-2xl",
                    "transform transition-transform duration-300 ease-in-out",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0 lg:static lg:flex-shrink-0"
                )}
            >
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Logo Section */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <ShoppingCartIcon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Azkia POS
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Versi 1.0</p>
                            </div>
                        </div>
                        <button
                            onClick={closeSidebar}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <SidebarLink
                                key={item.name}
                                href={item.href}
                                icon={item.icon}
                                onClick={closeSidebar}
                                isActive={item.current}
                                badge={item.badge}
                            >
                                {item.name}
                            </SidebarLink>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="border-t border-slate-200/60 dark:border-slate-700/60 p-4 space-y-4">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 border border-slate-200/60 dark:border-slate-700/60">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    Admin User
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    admin@mypos.com
                                </p>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Online
                            </Badge>
                        </div>

                    </div>
                </div>
            </aside>

            {/* Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden"
                />
            )}

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-h-screen overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-40 flex items-center justify-between bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 lg:hidden"
                        >
                            <MenuIcon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                        </button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                {getPageTitle()}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                Selamat Datang, min. Silahkan manage toko anda
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex items-center space-x-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                        >
                            <ScanBarcodeIcon className="w-4 h-4" />
                            <span>Scan Cepat</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                        >
                            <UserIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </Button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-slate-800/50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-t border-slate-200/60 dark:border-slate-700/60 px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center flex-wrap gap-3 sm:gap-4 mb-3 sm:mb-0 justify-center sm:justify-start">
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                System Online
                            </span>
                            <span className="hidden md:inline">⚡ Powered by Next.js 14 & Prisma</span>
                            <span className="hidden sm:inline">🔒 Secure & Reliable</span>
                        </div>
                        <div className="text-center sm:text-right">
                            &copy; {new Date().getFullYear()} Azkia. All rights reserved.
                            <span className="hidden md:inline"> - v2.0.0</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

// Sidebar Link Component
interface SidebarLinkProps {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    onClick: () => void;
    isActive?: boolean;
    badge?: string | null;
}

function SidebarLink({
    href,
    icon,
    children,
    onClick,
    isActive = false,
    badge = null
}: SidebarLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                "relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 group",
                "text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20",
                "hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg",
                isActive && "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20",
                isActive && "text-blue-600 dark:text-blue-400 shadow-lg",
                isActive && "border-r-2 border-blue-500"
            )}
        >
            <span className={cn(
                "mr-3 transition-transform duration-200",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-blue-600",
                "group-hover:scale-110"
            )}>
                {icon}
            </span>
            <span className="font-medium flex-1">{children}</span>

            {/* Active Indicator */}
            {isActive && (
                <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}

            {/* Badge */}
            {badge && (
                <Badge
                    variant="secondary"
                    className={cn(
                        "ml-2 text-xs px-2 py-0.5",
                        badge === 'Live' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                        badge === 'New' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    )}
                >
                    {badge}
                </Badge>
            )}
        </Link>
    );
}