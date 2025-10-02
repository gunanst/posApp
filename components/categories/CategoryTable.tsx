"use client";

import { useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    deleteCategory,
    createCategory,
    updateCategory,
} from "@/lib/actions/categoryAction";
import CategoryForm from "@/components/categories/CategoryForm";
import { Category } from "@/lib/type";

export default function CategoryTable({ category }: { category: Category[] }) {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState<Category | null>(null);
    const [isPending] = useTransition();

    return (
        <div>
            {/* Tombol tambah category */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                    <Button className="mb-4">Tambah Category</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Tambah Category</DialogTitle>
                    </DialogHeader>
                    <form action={createCategory} className="space-y-4 mt-4">
                        <CategoryForm />
                        <Button type="submit" className="w-full">
                            Simpan
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Tabel category */}
            <Table className="w-full border border-gray-300">
                <TableHeader>
                    <TableRow className="bg-gray-100">
                        <TableHead className="border px-4 py-2">#</TableHead>
                        <TableHead className="border px-4 py-2">Nama</TableHead>
                        <TableHead className="border px-4 py-2">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {category.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={3}
                                className="text-center py-2 text-gray-500"
                            >
                                Belum ada Category
                            </TableCell>
                        </TableRow>
                    ) : (
                        category.map((c, index) => (
                            <TableRow key={c.id}>
                                <TableCell className="border px-4 py-2">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="border px-4 py-2">{c.nama}</TableCell>
                                <TableCell className="border px-4 py-2 flex gap-2">
                                    {/* Tombol Edit */}
                                    <Button variant="outline" onClick={() => setOpenEdit(c)}>
                                        Edit
                                    </Button>

                                    {/* Tombol Hapus */}
                                    <form action={deleteCategory}>
                                        <input type="hidden" name="id" value={c.id} />
                                        <Button variant="destructive" type="submit">
                                            Hapus
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Dialog Edit Category */}
            <Dialog open={!!openEdit} onOpenChange={(open) => !open && setOpenEdit(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                    </DialogHeader>
                    {openEdit && (
                        <form action={updateCategory} className="space-y-4 mt-4">
                            <input type="hidden" name="id" value={openEdit.id} />
                            <CategoryForm defaultValues={openEdit} />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Updating..." : "Update"}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
