'use client';

import { useState } from 'react';
import { Product, CartItem, TransactionType } from '@/types/type';
import { createTransaction } from '@/lib/actions/transactionAction';
import { Button } from '@/components/ui/button';
import { CartDialog } from '@/components/transaction/CartDialog';
import { StrukDialog } from '@/components/transaction/StrukDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Package, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';

type POSProps = {
    products: Product[];
};

export default function POS({ products }: POSProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [struk, setStruk] = useState<TransactionType | null>(null);
    const [strukOpen, setStrukOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter products based on search
    const filteredProducts = products.filter(product =>
        product.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product) => {
        // Check stock availability
        if (product.stok !== null && product.stok <= 0) {
            setErrorMessage(`Stok ${product.nama} habis!`);
            return;
        }

        setCart(prev => {
            const exist = prev.find(c => c.product.id === product.id);
            if (exist) {
                // Check if quantity exceeds stock
                if (product.stok !== null && exist.quantity + 1 > product.stok) {
                    setErrorMessage(`Stok ${product.nama} tidak mencukupi!`);
                    return prev;
                }
                return prev.map(c =>
                    c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
        setErrorMessage(null);
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCart(prev => prev.map(c =>
            c.product.id === productId ? { ...c, quantity } : c
        ));
    };

    const total = cart.reduce((acc, c) => acc + c.product.harga * c.quantity, 0);
    const totalItems = cart.reduce((acc, c) => acc + c.quantity, 0);

    const handleCheckout = async () => {
        if (isCheckingOut) {
            console.log('Checkout sedang diproses, tunggu sebentar...');
            return;
        }

        if (cart.length === 0) {
            setErrorMessage('Keranjang kosong!');
            return;
        }

        setErrorMessage(null);
        setIsCheckingOut(true);

        try {
            const transaction = await createTransaction(
                cart.map(c => ({ productId: c.product.id, quantity: c.quantity }))
            );

            setStruk(transaction);
            setCart([]);
            setCartOpen(false);
            setStrukOpen(true);
        } catch (error: unknown) {
            console.error('Checkout error:', error);
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('Terjadi kesalahan saat checkout.');
            }
        } finally {
            setIsCheckingOut(false);
        }
    };

    const getStockStatus = (stok: number | null) => {
        if (stok === null || stok === 0) return { label: 'Habis', color: 'bg-red-100 text-red-700' };
        if (stok <= 10) return { label: 'Menipis', color: 'bg-orange-100 text-orange-700' };
        return { label: 'Tersedia', color: 'bg-green-100 text-green-700' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 p-4 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Point of Sale
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Kelola transaksi penjualan dengan mudah
                    </p>
                </div>

                {/* Cart Summary Button */}
                <Button
                    onClick={() => setCartOpen(true)}
                    disabled={isCheckingOut}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 relative"
                    size="lg"
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Keranjang
                    <Badge
                        variant="secondary"
                        className="ml-2 bg-white text-blue-600 hover:bg-white"
                    >
                        {totalItems} item
                    </Badge>
                    <div className="absolute -top-2 -right-2">
                        <Badge className="bg-green-500 text-white px-2 py-1 text-xs">
                            {formatRupiah(total)}
                        </Badge>
                    </div>
                </Button>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                                {errorMessage}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search Bar */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Cari produk atau scan barcode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product.stok);
                    const isOutOfStock = product.stok === 0 || product.stok === null;

                    return (
                        <Card
                            key={product.id}
                            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group ${isOutOfStock ? 'opacity-60' : 'hover:scale-105 cursor-pointer'
                                }`}
                        >
                            <CardContent className="p-4 flex flex-col h-full">
                                {/* Product Image */}
                                <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 mb-3 flex items-center justify-center">
                                    {product.image ? (
                                        <Image
                                            src={product.image}
                                            alt={product.nama}
                                            width={300}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Package className="h-12 w-12 text-slate-400" />
                                    )}
                                    <Badge
                                        variant="outline"
                                        className={`absolute top-2 right-2 text-xs border-0 ${stockStatus.color}`}
                                    >
                                        {stockStatus.label}
                                    </Badge>
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 space-y-2">
                                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 leading-tight">
                                        {product.nama}
                                    </h3>

                                    {product.barcode && (
                                        <p className="text-xs text-slate-500 font-mono">
                                            {product.barcode}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                            Rp {product.harga.toLocaleString('id-ID')}
                                        </p>
                                        {product.stok !== null && (
                                            <p className="text-xs text-slate-500">
                                                Stok: {product.stok}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                    onClick={() => addToCart(product)}
                                    disabled={isCheckingOut || isOutOfStock}
                                    className={`w-full mt-3 ${isOutOfStock
                                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                        }`}
                                    size="sm"
                                >
                                    {isOutOfStock ? (
                                        'Stok Habis'
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-1" />
                                            Tambah
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                        <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {searchTerm ? 'Produk tidak ditemukan' : 'Belum ada produk'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            {searchTerm
                                ? 'Coba ubah kata kunci pencarian Anda'
                                : 'Tambahkan produk terlebih dahulu di halaman produk'
                            }
                        </p>
                        {searchTerm && (
                            <Button
                                variant="outline"
                                onClick={() => setSearchTerm('')}
                            >
                                Reset Pencarian
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Floating Cart Button for Mobile */}
            <div className="fixed bottom-6 right-6 z-40 lg:hidden">
                <Button
                    onClick={() => setCartOpen(true)}
                    disabled={isCheckingOut}
                    className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl relative"
                    size="icon"
                >
                    <ShoppingCart className="h-6 w-6" />
                    {totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-1.5 py-0.5 text-xs min-w-5 h-5 flex items-center justify-center">
                            {totalItems}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Cart Dialog */}
            <CartDialog
                open={cartOpen}
                onOpenChange={setCartOpen}
                cart={cart}
                total={total}
                products={products}
                onUpdateQuantity={updateQuantity}
                onAddProduct={addToCart}
                onCheckout={handleCheckout}
                errorMessage={errorMessage}
                setCart={setCart}
                isCheckingOut={isCheckingOut}
            />

            {/* Struk Dialog */}
            <StrukDialog
                open={strukOpen}
                onOpenChange={setStrukOpen}
                struk={struk}
            />

            {/* Loading Overlay */}
            {isCheckingOut && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                Memproses Transaksi
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Sedang menyimpan data transaksi...
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

// Helper function untuk format Rupiah
function formatRupiah(num: number) {
    return "Rp " + num.toLocaleString("id-ID");
}