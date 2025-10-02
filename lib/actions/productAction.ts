'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

// === KONSTANTA ===
// Batas ukuran file gambar (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Format gambar yang diizinkan
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// === HELPER: Validasi input produk dari FormData ===
/**
 * Memvalidasi dan mengekstrak data produk dari FormData.
 * Mengembalikan objek dengan data yang sudah divalidasi.
 * Melempar error jika validasi gagal.
 */
function validateProductInput(formData: FormData) {
    const barcode = formData.get('barcode')?.toString().trim() || null;
    const nama = formData.get('nama')?.toString().trim();
    const hargaStr = formData.get('harga')?.toString();
    const stokStr = formData.get('stok')?.toString();

    if (!nama) throw new Error('Nama produk wajib diisi');
    if (!hargaStr || isNaN(Number(hargaStr)) || Number(hargaStr) <= 0) {
        throw new Error('Harga harus berupa angka positif');
    }
    if (!stokStr || isNaN(Number(stokStr)) || Number(stokStr) < 0) {
        throw new Error('Stok harus angka nol atau lebih');
    }

    return {
        barcode,
        nama,
        harga: Number(hargaStr),
        stok: Number(stokStr),
    };
}

// === HELPER: Validasi file gambar ===
/**
 * Memvalidasi file gambar:
 * - Ukuran maksimal 5MB
 * - Format harus termasuk dalam ALLOWED_IMAGE_TYPES
 * Jika file null/undefined, lewati validasi.
 */
function validateFile(file: File | null) {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) throw new Error('Ukuran gambar maksimal 5MB');
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error('Format gambar tidak didukung');
}

// === HELPER: Simpan file gambar ke direktori public ===
/**
 * Menyimpan file gambar ke folder `public/uploads`.
 * Mengembalikan path relatif (misal: `/uploads/1234567890-foto.jpg`)
 * yang bisa langsung digunakan di `<img src={...} />`.
 */
async function saveFile(file: File): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Hindari spasi & duplikat nama file
    const cleanFileName = file.name.replace(/\s+/g, '-');
    const filename = `${Date.now()}-${cleanFileName}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);
    return `/uploads/${filename}`;
}

// === HELPER: Hapus file gambar lama dari server ===
/**
 * Menghapus file fisik dari sistem jika path-nya valid.
 * Menerima `string | null | undefined` karena Prisma mengembalikan `null`
 * untuk field opsional seperti `image`.
 */
function deleteFileIfExists(filePath: string | null | undefined) {
    if (!filePath) return; // null, undefined, atau string kosong dianggap tidak valid
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

// === ACTION: Buat produk baru ===

export async function createProduct(formData: FormData) {
    try {
        const { barcode, nama, harga, stok } = validateProductInput(formData);

        const imageField = formData.get('image');
        let file: File | null = null;
        if (imageField instanceof File && imageField.size > 0) {
            file = imageField;
        }

        let imagePath: string | null = null;
        if (file) {
            validateFile(file);
            imagePath = await saveFile(file);
        }

        await prisma.product.create({
            data: { barcode, nama, harga, stok, image: imagePath },
        });

        revalidatePath('/dashboard/products');
    } catch (error: unknown) {
        console.error('Create product error:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Gagal membuat produk');
        } else {
            throw new Error('Gagal membuat produk');
        }
    }
}

// === ACTION: Ambil daftar produk aktif ===
/**
 * Mengambil semua produk yang **belum dihapus** (deletedAt = null).
 * Termasuk relasi ke kategori.
 */
export async function getProducts() {
    return await prisma.product.findMany({
        where: { deletedAt: null }, // Hanya tampilkan produk aktif
        orderBy: { createdAt: 'desc' },
        include: { Category: true },
    });
}

// === ACTION: Update produk ===

export async function updateProduct(formData: FormData) {
    try {
        const id = Number(formData.get('id'));
        if (!id || isNaN(id)) throw new Error('ID produk tidak valid');

        const { barcode, nama, harga, stok } = validateProductInput(formData);

        const categoryIdRaw = formData.get('categoryId');
        const categoryId = categoryIdRaw && !isNaN(Number(categoryIdRaw)) ? Number(categoryIdRaw) : null;

        // === AMAN: Ambil file hanya jika benar-benar File dan punya isi ===
        const imageField = formData.get('image');
        let file: File | null = null;
        if (imageField instanceof File && imageField.size > 0) {
            file = imageField;
        }

        const oldProduct = await prisma.product.findUnique({ where: { id } });
        if (!oldProduct) throw new Error('Produk tidak ditemukan');

        let imagePath = oldProduct.image; // pertahankan gambar lama jika tidak ada yang baru

        if (file) {
            // Hanya validasi & simpan jika ada file baru
            validateFile(file);
            deleteFileIfExists(oldProduct.image); // hapus gambar lama
            imagePath = await saveFile(file);
        }

        await prisma.product.update({
            where: { id },
            data: {
                barcode,
                nama,
                harga,
                stok,
                categoryId,
                image: imagePath,
            },
        });

        revalidatePath('/dashboard/products');
    } catch (error: unknown) {
        console.error('Update Product error:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Gagal mengupdate produk');
        } else {
            throw new Error('Gagal mengupdate produk');
        }
    }
}

// === ACTION: Soft Delete Produk (Profesional & Aman) ===
/**
 * Menandai produk sebagai "dihapus" dengan mengisi `deletedAt`.
 * TIDAK menghapus data dari database → menjaga integritas transaksi.
 * TIDAK perlu cek relasi ke TransactionItem karena data tetap ada.
 * Opsional: hapus file gambar jika tidak dibutuhkan lagi.
 */
export async function deleteProduct(formData: FormData) {
    try {
        const id = Number(formData.get('id'));
        if (!id || isNaN(id)) throw new Error('ID produk tidak valid');

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) throw new Error('Produk tidak ditemukan');

        // Soft delete: isi `deletedAt` dengan waktu sekarang
        await prisma.product.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        // Opsional: hapus file gambar (karena produk sudah tidak aktif)
        // Catatan: jika Anda ingin simpan gambar untuk audit, hapus baris ini.
        deleteFileIfExists(product.image);

        revalidatePath('/dashboard/products');
    } catch (error: unknown) {
        console.error('Create menghapus Product:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Gagal mengnonakfitkan product');
        } else {
            throw new Error('Gagal menonaktifkan product');
        }
    }
}