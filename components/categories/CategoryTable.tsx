"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    deleteCategory,
    createCategory,
    updateCategory,
} from "@/lib/actions/categoryAction";
import CategoryForm from "@/components/categories/CategoryForm";
import { Category } from "@/types/type";
import { Plus, Edit, Trash2, Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoryTableProps {
    category: Category[];
}

export default function CategoryTable({ category }: CategoryTableProps) {
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter categories based on search term
    const filteredCategories = category.filter(cat =>
        cat.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (formData: FormData) => {
        if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
            await deleteCategory(formData);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Manajemen Kategori
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Kelola kategori produk toko Anda
                    </p>
                </div>
                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Kategori
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <Plus className="h-5 w-5 text-blue-600" />
                                Tambah Kategori Baru
                            </DialogTitle>
                        </DialogHeader>
                        <form action={createCategory} className="space-y-4 mt-4">
                            <CategoryForm />
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenAdd(false)}
                                    className="flex-1 border-slate-300 dark:border-slate-600"
                                >
                                    Batal
                                </Button>
                                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                    placeholder="Cari kategori..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    Total Kategori
                                </p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                                    {category.length}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                    Ditampilkan
                                </p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                                    {filteredCategories.length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <Search className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                    Status
                                </p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                                    {category.length > 0 ? "Aktif" : "Kosong"}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block">
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                            <Package className="h-5 w-5 text-orange-600" />
                            Daftar Kategori
                            <Badge variant="secondary" className="ml-2">
                                {filteredCategories.length} kategori
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-50/50">
                                    <TableHead className="font-semibold text-slate-900 dark:text-white w-20">
                                        No
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-900 dark:text-white">
                                        Nama Kategori
                                    </TableHead>
                                    <TableHead className="font-semibold text-slate-900 dark:text-white text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                                <Package className="h-12 w-12 mb-4 opacity-50" />
                                                <p className="text-lg font-semibold mb-2">
                                                    {searchTerm ? "Kategori tidak ditemukan" : "Belum ada kategori"}
                                                </p>
                                                <p className="text-sm">
                                                    {searchTerm
                                                        ? "Coba ubah kata kunci pencarian"
                                                        : "Mulai tambahkan kategori pertama Anda"
                                                    }
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCategories.map((c, index) => (
                                        <TableRow
                                            key={c.id}
                                            className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                        {c.nama.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-900 dark:text-white">
                                                        {c.nama}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setOpenEdit(c)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <form action={handleDelete}>
                                                        <input type="hidden" name="id" value={c.id} />
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            type="submit"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Hapus
                                                        </Button>
                                                    </form>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden space-y-4">
                {filteredCategories.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {searchTerm ? "Kategori tidak ditemukan" : "Belum ada kategori"}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {searchTerm
                                    ? "Coba ubah kata kunci pencarian"
                                    : "Mulai tambahkan kategori pertama Anda"
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCategories.map((c, index) => (
                        <Card
                            key={c.id}
                            className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                            {c.nama.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {c.nama}
                                            </h3>
                                            <p className="text-sm text-slate-500">Kategori #{index + 1}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setOpenEdit(c)}
                                        className="flex-1 flex items-center gap-2"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </Button>
                                    <form action={handleDelete} className="flex-1">
                                        <input type="hidden" name="id" value={c.id} />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            type="submit"
                                            className="w-full flex items-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Hapus
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!openEdit} onOpenChange={(open) => !open && setOpenEdit(null)}>
                <DialogContent className="sm:max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                            <Edit className="h-5 w-5 text-yellow-600" />
                            Edit Kategori
                        </DialogTitle>
                    </DialogHeader>
                    {openEdit && (
                        <form action={updateCategory} className="space-y-4 mt-4">
                            <input type="hidden" name="id" value={openEdit.id} />
                            <CategoryForm defaultValues={openEdit} />
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenEdit(null)}
                                    className="flex-1 border-slate-300 dark:border-slate-600"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Update
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}