"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryFormProps } from "@/types/type";

export default function CategoryForm({ defaultValues }: CategoryFormProps) {
    return (
        <div className="space-y-4 p-6 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
            <div className="space-y-2">
                <Label
                    htmlFor="nama"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                    Nama Kategori
                </Label>

                <Input
                    id="nama"
                    name="nama"
                    required
                    defaultValue={defaultValues?.nama || ""}
                    placeholder="Contoh: Elektronik, Pakaian, Makanan"
                    className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    minLength={2}
                    maxLength={50}
                />

                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {defaultValues?.nama ? `${defaultValues.nama.length}/50 karakter` : "2-50 karakter"}
                </p>
            </div>
        </div>
    );
}