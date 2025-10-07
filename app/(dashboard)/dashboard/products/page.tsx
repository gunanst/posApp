import { getProducts } from '@/lib/actions/productAction'
import { getCategories } from '@/lib/actions/categoryAction'
import ProductTable from '@/components/products/ProductTable'
import { Product, Category } from "@/types/type";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export const dynamic = 'force-dynamic';
export default async function ProductPage() {
    let products: Product[] = []
    let categories: Category[] = []
    let error = null

    try {
        [products, categories] = await Promise.all([
            getProducts(),
            getCategories()
        ]);
    } catch (err) {
        console.error('Error Memuat Data', err)
        error = "Gagal memuat data produk"
    }

    // Hitung statistik
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => (p.stok || 0) <= 10 && (p.stok || 0) > 0).length;
    const outOfStockProducts = products.filter(p => (p.stok || 0) === 0).length;

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Manajemen Produk
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Kelola inventory dan stok produk toko Anda
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    Total Produk
                                </p>
                                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                                    {totalProducts}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                                    Stok Menipis
                                </p>
                                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                                    {lowStockProducts}
                                </p>
                            </div>
                            <div className="p-3 bg-orange-500/20 rounded-xl">
                                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                    Stok Habis
                                </p>
                                <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
                                    {outOfStockProducts}
                                </p>
                            </div>
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Alerts */}
            {(lowStockProducts > 0 || outOfStockProducts > 0) && (
                <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                    Perhatian Stok
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-400">
                                    {outOfStockProducts > 0 && `${outOfStockProducts} produk habis`}
                                    {outOfStockProducts > 0 && lowStockProducts > 0 && ' dan '}
                                    {lowStockProducts > 0 && `${lowStockProducts} produk menipis`}
                                    . Segera perbarui stok untuk kelancaran penjualan.
                                </p>
                            </div>
                            <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200">
                                Action Required
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Error State */}
            {error && (
                <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-red-800 dark:text-red-300">
                                    Gagal Memuat Data
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                    {error}. Silakan refresh halaman atau coba lagi nanti.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Product Table */}
            <ProductTable products={products} categories={categories} />
        </div>
    );
}