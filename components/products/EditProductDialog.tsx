"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { updateProduct } from "@/lib/actions/productAction";
import ProductForm from "./ProductForm";
import { Category, Product } from "@/types/type";

export default function EditProductDialog({ product, categories }: { product: Product, categories: Category[] }) {
    return (
        <Dialog>
            <DialogTrigger className="px-2 py-1 bg-yellow-500 text-white rounded">
                Edit
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Produk</DialogTitle>
                </DialogHeader>

                <form action={updateProduct} className="space-y-4 mt-4">
                    <input type="hidden" name="id" value={product.id} />
                    <ProductForm defaultValues={product} categories={categories} />
                    <button type="submit" className="w-full px-4 py-2 bg-yellow-500 text-white rounded">
                        Update
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
