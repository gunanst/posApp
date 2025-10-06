'use client';

import { useState } from 'react';
import { Product, CartItem, TransactionType } from '@/types/type';
import { createTransaction } from '@/lib/actions/transactionAction';
import { Button } from '@/components/ui/button';
import { CartDialog } from './CartDialog';
import { StrukDialog } from './StrukDialog';

type POSProps = {
    products: Product[];
};

export default function POS({ products }: POSProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [struk, setStruk] = useState<TransactionType | null>(null);
    const [strukOpen, setStrukOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false); // State untuk mencegah checkout ganda

    const addToCart = (product: Product) => {
        setCart(prev => {
            const exist = prev.find(c => c.product.id === product.id);
            if (exist) {
                return prev.map(c =>
                    c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCart(prev => prev.map(c =>
            c.product.id === productId ? { ...c, quantity } : c
        ));
    };

    const total = cart.reduce((acc, c) => acc + c.product.harga * c.quantity, 0);

    const handleCheckout = async () => {
        // Cegah checkout ganda
        if (isCheckingOut) {
            console.log('Checkout sedang diproses, tunggu sebentar...');
            return;
        }

        if (cart.length === 0) {
            setErrorMessage('Keranjang kosong!');
            return;
        }

        // Reset error dan set loading state
        setErrorMessage(null);
        setIsCheckingOut(true);

        try {
            const transaction = await createTransaction(
                cart.map(c => ({ productId: c.product.id, quantity: c.quantity }))
            );

            // Jika berhasil
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
            // Pastikan loading state direset baik sukses maupun gagal
            setIsCheckingOut(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tampilkan pesan error jika ada */}
            {errorMessage && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                    {errorMessage}
                </div>
            )}

            {/* Grid Produk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <div key={product.id} className="border rounded p-4 flex flex-col items-center justify-between">
                        <h3 className="font-semibold text-center">{product.nama}</h3>
                        <p className="text-sm text-gray-600 mb-2">Rp {product.harga.toLocaleString('id-ID')}</p>
                        <p className="text-sm text-gray-600 mb-2">Stok: {product.stok}</p>
                        <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={isCheckingOut} // Nonaktifkan tombol saat checkout berjalan
                        >
                            Tambah
                        </Button>
                    </div>
                ))}
            </div>

            {/* Tombol buka keranjang */}
            <div>
                <Button
                    onClick={() => setCartOpen(true)}
                    disabled={isCheckingOut} // Nonaktifkan tombol saat checkout berjalan
                >
                    Lihat Keranjang ({cart.length})
                </Button>
            </div>

            {/* Dialog Keranjang */}
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
                isCheckingOut={isCheckingOut} // Tambahkan prop untuk status checkout
            />

            {/* Dialog Struk */}
            <StrukDialog
                open={strukOpen}
                onOpenChange={setStrukOpen}
                struk={struk}
            />

            {/* Loading indicator (opsional) */}
            {isCheckingOut && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span>Memproses checkout...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}