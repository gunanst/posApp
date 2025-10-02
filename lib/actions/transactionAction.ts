'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Buat transaksi baru (checkout) + kurangi stok
export async function createTransaction(items: { productId: number; quantity: number }[]) {
    if (!items || items.length === 0) {
        throw new Error('Keranjang kosong!');
    }

    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds },
            deletedAt: null, // hanya produk aktif
        },
    });

    if (products.length !== items.length) {
        throw new Error('Beberapa produk tidak ditemukan atau sudah dihapus');
    }

    // Validasi awal: stok cukup?
    for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) continue;

        if (product.stok === null) continue; // stok tak terbatas

        if (item.quantity > product.stok) {
            throw new Error(`Stok produk "${product.nama}" tidak mencukupi. Tersedia: ${product.stok}`);
        }
    }

    const total = items.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId)!;
        return acc + product.harga * item.quantity;
    }, 0);

    // Jalankan dalam satu transaksi database
    const newTransaction = await prisma.$transaction(async (tx) => {
        // 1. Buat transaksi
        const createdTransaction = await tx.transaction.create({
            data: { // Gunakan `data` untuk payload
                total,
                items: {
                    create: items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                    })),
                },
            },
            include: {
                items: { include: { product: true } },
            },
        });

        // 2. Kurangi stok — dengan validasi ulang dalam transaksi
        for (const item of items) {
            const product = products.find(p => p.id === item.productId)!;

            if (product.stok === null) continue; // stok tak terbatas

            // 🔒 Baca stok terkini dalam transaksi untuk hindari race condition
            const current = await tx.product.findUnique({
                where: { id: product.id },
                select: { stok: true },
            });

            if (!current || current.stok === null) {
                throw new Error(`Produk "${product.nama}" tidak tersedia.`);
            }

            if (current.stok < item.quantity) {
                throw new Error(`Stok "${product.nama}" tidak mencukupi saat memproses transaksi.`);
            }

            await tx.product.update({
                where: { id: product.id },
                data: { stok: { decrement: item.quantity } },
            });
        }

        // Return hasil transaksi yang sudah dibuat dan stoknya dikurangi
        return createdTransaction;
    }); // Akhir dari prisma.$transaction

    // Revalidate path setelah transaksi berhasil
    revalidatePath('/dashboard/transaction');
    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/pos'); // pastikan POS juga refresh

    // Return transaksi yang telah selesai diproses
    return newTransaction;
} // Akhir dari fungsi createTransaction

// Ambil produk aktif untuk POS
export async function getProducts() {
    return prisma.product.findMany({
        where: { deletedAt: null }, // ✅ hanya aktif
        include: { Category: true },
        orderBy: { nama: 'asc' },
    });
}

// Ambil semua transaksi (termasuk produk yang mungkin sudah dihapus — untuk audit)
export async function getTransactions() {
    return prisma.transaction.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
    });
}