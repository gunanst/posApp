"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";

// Create Category
export async function createCategory(formData: FormData) {
    const nama = formData.get("nama") as string | null;
    console.log(">> isi formData:", nama);

    if (!nama) {
        throw new Error("Nama kategori kosong / tidak dikirim dari form");
    }

    try {
        await prisma.category.create({
            data: { nama },
        });
    } catch (err) {
        console.error("Create category error:", err);
        throw new Error("Gagal membuat kategori");
    }
    revalidatePath("/dashboard/category");
}

// Get all categories
export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { id: "desc" }, // opsional biar terbaru muncul dulu
    });
}

//UPDATE
export async function updateCategory(formData: FormData) {
    const id = Number(formData.get("id"));
    const nama = formData.get("nama") as string;

    if (!id || !nama) throw new Error("Data tidak lengkap");

    await prisma.category.update({
        where: { id },
        data: { nama },
    });

    // ✅ Refresh halaman /product biar data update
    revalidatePath("/dashboard/category");
}

// Delete category
export async function deleteCategory(formData: FormData) {
    const id = Number(formData.get("id"));
    if (!id) throw new Error("ID kategori tidak valid");

    try {
        await prisma.category.delete({
            where: { id },
        });

        // Refresh halaman setelah hapus
        revalidatePath("/dashboard/category");
    } catch (error) {
        console.error("Delete category error:", error);
        throw new Error("Gagal menghapus kategori");
    }
}
