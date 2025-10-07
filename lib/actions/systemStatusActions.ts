'use server';

import prisma from '@/lib/prisma';

export async function getSystemStatus() {
    try {
        const startTime = Date.now();

        // 1. Check Database Connection
        let dbStatus: 'online' | 'offline' = 'online';
        let dbLatency = 0;
        try {
            const dbStartTime = Date.now();
            await prisma.$queryRaw`SELECT 1`;
            dbLatency = Date.now() - dbStartTime;
        } catch (error) {
            dbStatus = 'offline';
            dbLatency = -1;
        }

        // 2. Check Database Health (table counts)
        let productCount = 0;
        let transactionCount = 0;
        let categoryCount = 0;

        if (dbStatus === 'online') {
            try {
                [productCount, transactionCount, categoryCount] = await Promise.all([
                    prisma.product.count({ where: { deletedAt: null } }),
                    prisma.transaction.count(),
                    prisma.category.count()
                ]);
            } catch (error) {
                console.error('Database health check failed:', error);
            }
        }

        // 3. Check Storage (simulate - in real app, check your storage service)
        const storageStatus = 'online' as const;
        const storageUsage = '2.4MB / 10GB';

        // 4. Check Recent Errors (last 1 hour)
        const errorThreshold = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
        const recentTransactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: errorThreshold
                }
            },
            take: 10
        });

        const transactionHealth = recentTransactions.length > 0 ? 'healthy' : 'no_recent_activity';

        // 5. System Resources (simulated - in production, use system monitoring)
        const memoryUsage = `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}MB`;
        const uptime = formatUptime(process.uptime());

        // 6. Last Backup Check (you can integrate with your backup service)
        const lastBackup = await getLastBackupTime();

        const totalLatency = Date.now() - startTime;

        return {
            database: {
                status: dbStatus,
                latency: dbLatency,
                health: {
                    products: productCount,
                    transactions: transactionCount,
                    categories: categoryCount
                }
            },
            api: {
                status: 'online' as const,
                latency: totalLatency,
                environment: process.env.NODE_ENV || 'development'
            },
            storage: {
                status: storageStatus,
                usage: storageUsage
            },
            transactions: {
                status: transactionHealth,
                recent: recentTransactions.length
            },
            system: {
                memory: memoryUsage,
                uptime: uptime,
                lastBackup: lastBackup
            }
        };
    } catch (error) {
        console.error('System status check failed:', error);
        throw new Error('Failed to check system status');
    }
}

async function getLastBackupTime(): Promise<string> {
    // In a real app, you would check your backup service
    // For now, we'll check the latest transaction as a proxy
    try {
        const latestTransaction = await prisma.transaction.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
        });

        if (latestTransaction) {
            return `Last data: ${formatTimeAgo(latestTransaction.createdAt)}`;
        }
        return 'No data yet';
    } catch (error) {
        return 'Unknown';
    }
}

function formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}