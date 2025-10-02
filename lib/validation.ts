import { z } from "zod";

export const productSchema = z.object({
    id: z.number().optional(),
    barcode: z.string().nullable().optional(),
    nama: z.string().min(1, "Nama produk wajib diisi"),
    harga: z.number().positive("Harga harus berupa angka positif"),
    stok: z.number().min(0, "Stok harus nol atau lebih"),
    categoryId: z.number().nullable().optional(),
});

export const fileSchema = z
    .object({
        size: z.number(),
        type: z.string(),
        name: z.string(),
        arrayBuffer: z.function().returns(Promise.resolve(new ArrayBuffer(0))),
    })
    .partial(); // bisa null / undefined

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

export function validateFile(file: File | null) {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran gambar maksimal 5MB");
    if (!ALLOWED_IMAGE_TYPES.includes(file.type))
        throw new Error("Format gambar tidak didukung");
}
