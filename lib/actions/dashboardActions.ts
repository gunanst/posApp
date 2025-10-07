'use server';

import prisma from '@/lib/prisma';

export async function getDashboardData() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Hitung statistik hari ini
        const todayTransactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Total produk (exclude soft deleted)
        const totalProducts = await prisma.product.count({
            where: {
                deletedAt: null
            }
        });

        // Total kategori
        const totalCategories = await prisma.category.count();

        // Produk dengan stok menipis (<= 10)
        const lowStockItems = await prisma.product.count({
            where: {
                stok: {
                    lte: 10,
                    gt: 0
                },
                deletedAt: null
            }
        });

        // Produk stok habis
        const outOfStockItems = await prisma.product.count({
            where: {
                OR: [
                    { stok: 0 },
                    { stok: null }
                ],
                deletedAt: null
            }
        });

        // Total pendapatan hari ini
        const todayRevenue = todayTransactions.reduce((sum, transaction) => sum + transaction.total, 0);

        // Transaksi kemarin untuk perbandingan
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayTransactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: yesterday,
                    lt: today
                }
            }
        });

        const yesterdayRevenue = yesterdayTransactions.reduce((sum, transaction) => sum + transaction.total, 0);
        const revenueChange = yesterdayRevenue > 0 ?
            Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100) : 100;

        const transactionChange = yesterdayTransactions.length > 0 ?
            Math.round(((todayTransactions.length - yesterdayTransactions.length) / yesterdayTransactions.length) * 100) : 100;

        // 5 transaksi terbaru untuk preview
        const recentTransactions = await prisma.transaction.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                nama: true,
                                harga: true
                            }
                        }
                    }
                }
            }
        });

        return {
            totalProducts,
            totalCategories,
            todayTransactions: todayTransactions.length,
            todayRevenue,
            lowStockItems,
            outOfStockItems,
            revenueChange,
            transactionChange,
            recentTransactions: recentTransactions.map(transaction => ({
                id: transaction.id,
                createdAt: transaction.createdAt,
                total: transaction.total,
                items: transaction.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    product: {
                        nama: item.product.nama,
                        harga: item.product.harga
                    }
                }))
            }))
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Gagal memuat data dashboard');
    }
}