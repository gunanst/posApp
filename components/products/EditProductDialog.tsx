"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface EditProductDialogProps {
    product: Product;
    categories: Category[];
    trigger?: React.ReactNode;
}

export default function EditProductDialog({
    product,
    categories,
    trigger
}: EditProductDialogProps) {
    const [open, setOpen] = useState(false);

    const handleAction = async (formData: FormData) => {
        try {
            await updateProduct(formData);
            setOpen(false);
            // Optional: Add success notification or refresh data
        } catch (error) {
            console.error('Error updating product:', error);
            // Optional: Add error notification
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <Edit className="h-5 w-5 text-yellow-600" />
                        Edit Produk
                    </DialogTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Perbarui informasi produk "{product.nama}"
                    </p>
                </DialogHeader>

                <form action={handleAction} className="space-y-4 mt-4">
                    <input type="hidden" name="id" value={product.id} />

                    <ProductForm
                        defaultValues={product}
                        categories={categories}
                    />

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1 border-slate-300 dark:border-slate-600"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Update Produk
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}