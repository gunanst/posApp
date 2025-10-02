"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createProduct } from "@/lib/actions/productAction";
import ProductForm from "./ProductForm";
import { Category } from "@/lib/type";

export default function CreateProductDialog({ categories }: { categories: Category[] }) {
    return (
        <Dialog>
            <DialogTrigger className="px-4 py-2 bg-blue-600 text-white rounded">
                + Tambah Produk
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Produk</DialogTitle>
                </DialogHeader>

                <form action={createProduct} className="space-y-4 mt-4">
                    <ProductForm categories={categories} />
                    <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded">
                        Simpan
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
