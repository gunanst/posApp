'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Category, Product } from '@/types/type';
import { deleteProduct } from '@/lib/actions/productAction';
import CreateProductDialog from './CreateProductDialog';
import EditProductDialog from './EditProductDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Package,
    Filter,
    SortAsc
} from 'lucide-react';
import Image from 'next/image';

export default function ProductTable({
    products,
    categories,
}: {
    products: Product[];
    categories: Category[];
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'nama' | 'harga' | 'stok'>('nama');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Filter dan sort products
    const filteredProducts = products
        .filter(product =>
            product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(product =>
            filterCategory === 'all' || product.Category?.nama === filterCategory
        )
        .sort((a, b) => {
            if (sortBy === 'nama') return a.nama.localeCompare(b.nama);
            if (sortBy === 'harga') return a.harga - b.harga;
            if (sortBy === 'stok') return (a.stok || 0) - (b.stok || 0);
            return 0;
        });

    const getStockStatus = (stok: number | null) => {
        if (stok === null || stok === 0) return { label: 'Habis', color: 'bg-red-100 text-red-700' };
        if (stok <= 10) return { label: 'Menipis', color: 'bg-orange-100 text-orange-700' };
        return { label: 'Tersedia', color: 'bg-green-100 text-green-700' };
    };

    return (
        <div className="space-y-6">
            {/* Header dengan Search dan Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Daftar Produk
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Kelola inventory produk toko Anda
                    </p>
                </div>
                <CreateProductDialog categories={categories} />
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                        placeholder="Cari produk atau barcode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                </div>

                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Kategori
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setFilterCategory('all')}>
                                Semua Kategori
                            </DropdownMenuItem>
                            {categories.map(category => (
                                <DropdownMenuItem
                                    key={category.id}
                                    onClick={() => setFilterCategory(category.nama)}
                                >
                                    {category.nama}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <SortAsc className="h-4 w-4" />
                                Urutkan
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSortBy('nama')}>
                                Nama Produk
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('harga')}>
                                Harga
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('stok')}>
                                Stok
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Info Results */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Menampilkan <span className="font-semibold">{filteredProducts.length}</span> dari{' '}
                    <span className="font-semibold">{products.length}</span> produk
                </p>
                {filterCategory !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        {filterCategory}
                    </Badge>
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block">
                <div className="border rounded-xl overflow-hidden shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-50/50">
                                <TableHead className="font-semibold text-slate-900 dark:text-white">
                                    Produk
                                </TableHead>
                                <TableHead className="font-semibold text-slate-900 dark:text-white">
                                    Barcode
                                </TableHead>
                                <TableHead className="font-semibold text-slate-900 dark:text-white">
                                    Harga
                                </TableHead>
                                <TableHead className="font-semibold text-slate-900 dark:text-white">
                                    Stok
                                </TableHead>
                                <TableHead className="font-semibold text-slate-900 dark:text-white">
                                    Kategori
                                </TableHead>
                                <TableHead className="font-semibold text-slate-900 dark:text-white text-right">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => {
                                const stockStatus = getStockStatus(product.stok);
                                return (
                                    <TableRow
                                        key={product.id}
                                        className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                                                    {product.image ? (
                                                        <Image
                                                            src={product.image}
                                                            alt={product.nama}
                                                            fill
                                                            className="object-cover"
                                                            sizes="48px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {product.nama}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${stockStatus.color} border-transparent`}
                                                    >
                                                        {stockStatus.label}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-slate-600 dark:text-slate-400">
                                            {product.barcode || '-'}
                                        </TableCell>
                                        <TableCell className="font-semibold text-slate-900 dark:text-white">
                                            Rp {product.harga.toLocaleString('id-ID')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${(product.stok || 0) === 0 ? 'bg-red-500' :
                                                        (product.stok || 0) <= 10 ? 'bg-orange-500' : 'bg-green-500'
                                                    }`} />
                                                <span className="font-medium">{product.stok ?? 0}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {product.Category ? (
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {product.Category.nama}
                                                </Badge>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <EditProductDialog
                                                            product={product}
                                                            categories={categories}
                                                            trigger={
                                                                <div className="flex items-center w-full">
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit Produk
                                                                </div>
                                                            }
                                                        />
                                                    </DropdownMenuItem>
                                                    <form action={deleteProduct} className="w-full">
                                                        <input type="hidden" name="id" value={product.id} />
                                                        <DropdownMenuItem asChild>
                                                            <button
                                                                type="submit"
                                                                className="w-full flex items-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1.5 text-sm"
                                                                onClick={(e) => {
                                                                    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Hapus
                                                            </button>
                                                        </DropdownMenuItem>
                                                    </form>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile Card List */}
            <div className="lg:hidden space-y-4">
                {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stok);
                    return (
                        <div
                            key={product.id}
                            className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 flex-shrink-0">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.nama}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                                                <Package className="h-6 w-6 text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                                    {product.nama}
                                                </h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                                                    {product.barcode || 'No barcode'}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`flex-shrink-0 ml-2 ${stockStatus.color} border-transparent`}
                                            >
                                                {stockStatus.label}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 dark:text-slate-400">Harga</p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    Rp {product.harga.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 dark:text-slate-400">Stok</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${(product.stok || 0) === 0 ? 'bg-red-500' :
                                                            (product.stok || 0) <= 10 ? 'bg-orange-500' : 'bg-green-500'
                                                        }`} />
                                                    <span className="font-semibold">{product.stok ?? 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {product.Category && (
                                            <div className="mt-2">
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                    {product.Category.nama}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <EditProductDialog
                                    product={product}
                                    categories={categories}
                                    trigger={
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    }
                                />
                                <form action={deleteProduct} className="inline">
                                    <input type="hidden" name="id" value={product.id} />
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => {
                                            if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Hapus
                                    </Button>
                                </form>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Tidak ada produk ditemukan
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {searchTerm || filterCategory !== 'all'
                            ? 'Coba ubah pencarian atau filter Anda'
                            : 'Mulai tambahkan produk pertama Anda'
                        }
                    </p>
                    {(searchTerm || filterCategory !== 'all') ? (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterCategory('all');
                            }}
                        >
                            Reset Pencarian
                        </Button>
                    ) : (
                        <CreateProductDialog categories={categories} />
                    )}
                </div>
            )}
        </div>
    );
}