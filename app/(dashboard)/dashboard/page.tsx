import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShoppingCartIcon,
    PackageIcon,
    TrendingUpIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    EyeIcon,
    PlusIcon,
    AlertTriangleIcon,
    DatabaseIcon,
    ServerIcon,
    HardDriveIcon,
    ActivityIcon
} from "lucide-react";
import Link from "next/link";
import { getDashboardData } from "@/lib/actions/dashboardActions";
import { getSystemStatus } from "@/lib/actions/systemStatusActions";

function formatRupiah(num: number) {
    return "Rp " + num.toLocaleString("id-ID");
}

function formatTime(date: Date) {
    return date.toLocaleTimeString("id-ID", {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusColor(status: string) {
    switch (status) {
        case 'online':
        case 'healthy':
            return 'bg-green-500';
        case 'offline':
            return 'bg-red-500';
        case 'degraded':
            return 'bg-orange-500';
        case 'no_recent_activity':
            return 'bg-blue-500';
        default:
            return 'bg-gray-500';
    }
}

function getStatusText(status: string) {
    switch (status) {
        case 'online':
            return 'Online';
        case 'offline':
            return 'Offline';
        case 'healthy':
            return 'Healthy';
        case 'degraded':
            return 'Degraded';
        case 'no_recent_activity':
            return 'No Activity';
        default:
            return status;
    }
}

export default async function DashboardPage() {
    const [data, systemStatus] = await Promise.all([
        getDashboardData(),
        getSystemStatus()
    ]);

    const stats = [
        {
            title: "Total Products",
            value: data.totalProducts.toString(),
            icon: <PackageIcon className="h-6 w-6" />,
            change: "+8%",
            trend: "up" as const,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-700 dark:text-blue-300",
            href: "/dashboard/products"
        },
        {
            title: "Today's Transactions",
            value: data.todayTransactions.toString(),
            icon: <ShoppingCartIcon className="h-6 w-6" />,
            change: `${data.transactionChange >= 0 ? '+' : ''}${data.transactionChange}%`,
            trend: data.transactionChange >= 0 ? "up" : "down" as const,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-500/10",
            textColor: "text-green-700 dark:text-green-300",
            href: "/dashboard/transaction"
        },
        {
            title: "Today's Revenue",
            value: formatRupiah(data.todayRevenue),
            icon: <TrendingUpIcon className="h-6 w-6" />,
            change: `${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange}%`,
            trend: data.revenueChange >= 0 ? "up" : "down" as const,
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-700 dark:text-purple-300",
            href: "/dashboard/history"
        },
        {
            title: "Low Stock Alert",
            value: data.lowStockItems.toString(),
            icon: <AlertTriangleIcon className="h-6 w-6" />,
            change: "Need attention",
            trend: "down" as const,
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-500/10",
            textColor: "text-orange-700 dark:text-orange-300",
            href: "/dashboard/products?filter=low-stock"
        }
    ];

    const quickActions = [
        {
            title: "New Transaction",
            description: "Start a new sales transaction",
            icon: <PlusIcon className="h-6 w-6" />,
            href: "/dashboard/transaction",
            color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
            badge: null
        },
        {
            title: "Add Product",
            description: "Add new product to inventory",
            icon: <PackageIcon className="h-6 w-6" />,
            href: "/dashboard/products/new",
            color: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
            badge: "Quick"
        },
        {
            title: "View Reports",
            description: "Sales analytics and insights",
            icon: <TrendingUpIcon className="h-6 w-6" />,
            href: "/dashboard/history",
            color: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
            badge: "New"
        }
    ];

    const systemServices = [
        {
            name: "Database",
            status: systemStatus.database.status,
            latency: systemStatus.database.latency > 0 ? `${systemStatus.database.latency}ms` : 'Offline',
            icon: <DatabaseIcon className="h-4 w-4" />,
            details: {
                products: systemStatus.database.health.products,
                transactions: systemStatus.database.health.transactions,
                categories: systemStatus.database.health.categories
            }
        },
        {
            name: "API Server",
            status: systemStatus.api.status,
            latency: `${systemStatus.api.latency}ms`,
            icon: <ServerIcon className="h-4 w-4" />,
            details: {
                environment: systemStatus.api.environment,
                response: 'Healthy'
            }
        },
        {
            name: "Storage",
            status: systemStatus.storage.status,
            latency: systemStatus.storage.usage,
            icon: <HardDriveIcon className="h-4 w-4" />,
            details: {
                usage: systemStatus.storage.usage,
                status: 'Normal'
            }
        },
        {
            name: "Transactions",
            status: systemStatus.transactions.status,
            latency: `${systemStatus.transactions.recent} recent`,
            icon: <ActivityIcon className="h-4 w-4" />,
            details: {
                health: systemStatus.transactions.status === 'healthy' ? 'Normal' : 'Check',
                activity: systemStatus.transactions.recent
            }
        },

    ];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    {/* <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Welcome back! Here's what's happening with your store today.
                    </p> */}
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="flex items-center space-x-2 border-slate-300 dark:border-slate-600">
                        <EyeIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">View Analytics</span>
                    </Button>
                    <Link href="/dashboard/transaction">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                            <PlusIcon className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">New Transaction</span>
                            <span className="sm:hidden">Transaksi</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                    <Link key={index} href={stat.href}>
                        <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                        <div className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                            {stat.icon}
                                        </div>
                                    </div>
                                    <Badge
                                        variant={stat.trend === "up" ? "default" : "destructive"}
                                        className={`
                                            text-xs ${stat.trend === "up"
                                                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                                            }
                                        `}
                                    >
                                        {stat.trend === "up" ?
                                            <ArrowUpIcon className="h-3 w-3 mr-1" /> :
                                            <ArrowDownIcon className="h-3 w-3 mr-1" />
                                        }
                                        {stat.change}
                                    </Badge>
                                </div>
                                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {stat.title}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Quick Actions & System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                                <TrendingUpIcon className="h-5 w-5 text-blue-600" />
                                <span>Quick Actions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {quickActions.map((action, index) => (
                                    <Link key={index} href={action.href}>
                                        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-slate-50/50 dark:bg-slate-700/50 hover:scale-105 cursor-pointer group">
                                            <CardContent className="p-4 sm:p-6 text-center">
                                                {action.badge && (
                                                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs">
                                                        {action.badge}
                                                    </Badge>
                                                )}
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                    <div className="text-white">
                                                        {action.icon}
                                                    </div>
                                                </div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-sm sm:text-base">
                                                    {action.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                                    {action.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Real System Status */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus.database.status)} animate-pulse`} />
                            <span>System Status</span>
                            <Badge variant="secondary" className="text-xs">
                                Live
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {systemServices.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                                        <div className="text-slate-500">
                                            {service.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                            {service.name}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {service.latency}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant={service.status === 'online' || service.status === 'healthy' ? "default" : "destructive"}
                                    className={`
                                        text-xs ${service.status === 'online' || service.status === 'healthy'
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : service.status === 'offline'
                                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                        }
                                    `}
                                >
                                    {getStatusText(service.status)}
                                </Badge>
                            </div>
                        ))}

                        {/* System Metrics */}
                        <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-300 mb-2">
                                <ActivityIcon className="h-4 w-4" />
                                <span className="font-semibold text-sm">System Metrics</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="text-slate-700 dark:text-slate-400 font-medium">
                                        {systemStatus.system.memory}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-500">Memory</p>
                                </div>
                                <div>
                                    <p className="text-slate-700 dark:text-slate-400 font-medium">
                                        {systemStatus.system.uptime}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-500">Uptime</p>
                                </div>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    {systemStatus.system.lastBackup}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions Preview */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between text-slate-900 dark:text-white">
                        <div className="flex items-center space-x-2">
                            <ShoppingCartIcon className="h-5 w-5 text-blue-600" />
                            <span>Recent Transactions</span>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Today
                            </Badge>
                        </div>
                        <Link href="/dashboard/history">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                View All
                            </Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {data.recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No transactions today</p>
                                <p className="text-sm mt-1">Start selling to see transactions here</p>
                            </div>
                        ) : (
                            data.recentTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                            {transaction.items.reduce((sum, item) => sum + item.quantity, 0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                                                TRX-{transaction.id.toString().padStart(4, '0')}
                                            </p>
                                            <p className="text-xs sm:text-sm text-slate-500">
                                                {formatTime(new Date(transaction.createdAt))}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                {transaction.items.length} items
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                            {formatRupiah(transaction.total)}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 text-xs mt-1"
                                        >
                                            Completed
                                        </Badge>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}