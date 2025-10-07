// components/DashboardLayout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { UsersIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/lib/actions/authActions';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();

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

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutUser();
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    // Navigation berdasarkan role user
    const baseNavigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: <HomeIcon className="w-5 h-5" />,
            current: pathname === '/dashboard',
            badge: null,
            roles: ['ADMIN', 'KASIR']
        },
        {
            name: 'POS',
            href: '/dashboard/transaction',
            icon: <ShoppingCartIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/transaction',
            badge: 'Live',
            roles: ['ADMIN', 'KASIR']
        },
        {
            name: 'History',
            href: '/dashboard/history',
            icon: <ClockIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/history',
            badge: null,
            roles: ['ADMIN', 'KASIR']
        },
        {
            name: 'Reports',
            href: '/dashboard/reports',
            icon: <BarChart3Icon className="w-5 h-5" />,
            current: pathname === '/dashboard/reports',
            badge: 'New',
            roles: ['ADMIN', 'KASIR']
        }
    ];

    const adminNavigation = [
        {
            name: 'Products',
            href: '/dashboard/products',
            icon: <PackageIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/products',
            badge: null,
            roles: ['ADMIN']
        },
        {
            name: 'Categories',
            href: '/dashboard/categories',
            icon: <LayoutGridIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/categories',
            badge: null,
            roles: ['ADMIN']
        },
        {
            name: 'Users',
            href: '/dashboard/users',
            icon: <UsersIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/users',
            badge: null,
            roles: ['ADMIN']
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: <SettingsIcon className="w-5 h-5" />,
            current: pathname === '/dashboard/settings',
            badge: null,
            roles: ['ADMIN']
        }
    ];

    // Combine navigation berdasarkan role
    const navigation = user?.role === 'ADMIN'
        ? [...baseNavigation, ...adminNavigation]
        : baseNavigation;

    // Filter navigation berdasarkan role user
    const filteredNavigation = navigation.filter(item =>
        item.roles.includes(user?.role || 'KASIR')
    );

    // Get current page title
    const getPageTitle = () => {
        const currentNav = filteredNavigation.find(item => item.current);
        return currentNav?.name || 'Dashboard';
    };

    const getUserInitials = (username: string) => {
        return username?.charAt(0).toUpperCase() || 'U';
    };

    const getRoleColor = (role: string) => {
        return role === 'ADMIN'
            ? 'from-purple-500 to-pink-500'
            : 'from-blue-500 to-cyan-500';
    };

    const getRoleBadge = (role: string) => {
        return role === 'ADMIN'
            ? <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Admin</Badge>
            : <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Kasir</Badge>;
    };

    const getRoleText = (role: string) => {
        return role === 'ADMIN' ? 'Admin Panel' : 'Kasir Panel';
    };

    // Tampilkan loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    // Redirect jika tidak ada user
    if (!user) {
        router.push('/login');
        return null;
    }

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
                                    TOKO AZKIA
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {getRoleText(user.role)}
                                </p>
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
                        {filteredNavigation.map((item) => (
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
                            <div className={`w-10 h-10 bg-gradient-to-r ${getRoleColor(user.role)} rounded-xl flex items-center justify-center shadow-lg`}>
                                <span className="text-white font-bold text-sm">
                                    {getUserInitials(user.username)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                    {user.username}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {user.email}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    {getRoleBadge(user.role)}
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                                Online
                            </Badge>
                        </div>

                        {/* Logout Button */}
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex justify-start space-x-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-xl py-3"
                        >
                            {isLoggingOut ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                    <span className="font-medium">Logging out...</span>
                                </div>
                            ) : (
                                <>
                                    <LogOutIcon className="w-4 h-4" />
                                    <span className="font-medium">Logout</span>
                                </>
                            )}
                        </Button>
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
                                Halo, <span className="font-semibold text-slate-700 dark:text-slate-300">{user.username}</span>! 👋
                                <span className="hidden sm:inline"> - Selamat beraktivitas</span>
                            </p>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Mobile User Info */}
                        <div className="lg:hidden flex items-center space-x-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user.role)} rounded-lg flex items-center justify-center shadow-lg`}>
                                <span className="text-white font-bold text-xs">
                                    {getUserInitials(user.username)}
                                </span>
                            </div>
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {user.username}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {user.role === 'ADMIN' ? 'Admin' : 'Kasir'}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex items-center space-x-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                        >
                            <ScanBarcodeIcon className="w-4 h-4" />
                            <span>Scan Cepat</span>
                        </Button>

                        {/* Mobile Logout Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="lg:hidden border-slate-300 dark:border-slate-600"
                        >
                            {isLoggingOut ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                            ) : (
                                <LogOutIcon className="w-4 h-4" />
                            )}
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
                                System Online • {user.role === 'ADMIN' ? 'Admin Mode' : 'Kasir Mode'}
                            </span>
                            <span className="hidden md:inline">⚡ Powered by Next.js 15 & Prisma</span>
                            <span className="hidden sm:inline">🔒 Secure & Reliable</span>
                        </div>
                        <div className="text-center sm:text-right">
                            &copy; {new Date().getFullYear()} TOKO AZKIA.
                            <span className="hidden md:inline"> Logged in as {user.username}</span>
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