"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createProduct } from "@/lib/actions/productAction";
import ProductForm from "./ProductForm";
import { Category } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface CreateProductDialogProps {
    categories: Category[];
}

export default function CreateProductDialog({ categories }: CreateProductDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            await createProduct(formData);
            setOpen(false);
            // Reset form atau refresh data bisa ditambahkan di sini
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                Tambah Produk Baru
                            </DialogTitle>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                Isi informasi produk baru untuk ditambahkan ke inventory
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-5 mt-2">
                    <ProductForm categories={categories} />

                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="flex-1 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Simpan Produk
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}