// POS.tsx
'use client';

import { useState } from 'react';
import { Product, CartItem, TransactionType } from '@/app/types/type';
import { createTransaction } from '@/lib/actions/transactionAction'; // Pastikan path benar
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
    // State untuk menampung pesan error
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        if (cart.length === 0) {
            // Tidak perlu alert, cukup tampilkan di UI
            setErrorMessage('Keranjang kosong!');
            return;
        }

        // Reset error sebelum checkout
        setErrorMessage(null);

        try {
            // Bungkus pemanggilan server action dalam try-catch
            const transaction = await createTransaction(
                cart.map(c => ({ productId: c.product.id, quantity: c.quantity }))
            );
            // Jika berhasil
            setStruk(transaction);
            setCart([]);
            setCartOpen(false);
            setStrukOpen(true);
        } catch (error: unknown) { // Tangkap error dari server action
            console.error('Checkout error:', error); // Log untuk debugging
            if (error instanceof Error) {
                // Tampilkan pesan error dari server action di UI
                setErrorMessage(error.message); // Pesan: "Stok produk ... tidak mencukupi..."
            } else {
                // Jika error bukan instance dari Error, tampilkan pesan umum
                setErrorMessage('Terjadi kesalahan saat checkout.');
            }
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
                        <Button size="sm" onClick={() => addToCart(product)}>Tambah</Button>
                    </div>
                ))}
            </div>

            {/* Tombol buka keranjang */}
            <div>
                <Button onClick={() => setCartOpen(true)}>Lihat Keranjang ({cart.length})</Button>
            </div>

            {/* Dialog Keranjang */}
            {/* Kirim errorMessage ke CartDialog jika ingin ditampilkan di sana juga */}
            <CartDialog
                open={cartOpen}
                onOpenChange={setCartOpen}
                cart={cart}
                total={total}
                products={products}
                onUpdateQuantity={updateQuantity}
                onAddProduct={addToCart}
                onCheckout={handleCheckout}
                errorMessage={errorMessage} // Tambahkan prop ini
                setCart={setCart}
            />

            {/* Dialog Struk */}
            <StrukDialog
                open={strukOpen}
                onOpenChange={setStrukOpen}
                struk={struk}
            />
        </div>
    );
}