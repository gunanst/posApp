"use client";

import { useState } from "react";
import { CartItem, Product } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XMarkIcon } from '@heroicons/react/24/solid'; // ✅ Ganti XIcon ke XMarkIcon
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import BarcodeScanner from "@/components/transaction/BarcodeScanner";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type CartDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: CartItem[];
    total: number;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onCheckout: () => void;
    products: Product[];
    onAddProduct: (product: Product) => void;
    errorMessage?: string | null;
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export function CartDialog({
    open,
    onOpenChange,
    cart,
    total,
    onUpdateQuantity,
    onCheckout,
    products,
    onAddProduct,
    errorMessage,
    setCart,
}: CartDialogProps) {
    const [search, setSearch] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null);

    const filteredProducts = products.filter(
        (p) =>
            p.nama.toLowerCase().includes(search.toLowerCase()) ||
            p.barcode?.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = () => {
        const code = search.trim().toLowerCase();
        if (!code) return;

        const found = products.find(
            (p) =>
                p.barcode?.toLowerCase() === code || p.nama.toLowerCase().includes(code)
        );

        if (found) {
            onAddProduct(found);
            setSearch("");
            setShowScanner(false);
        } else {
            alert("Produk tidak ditemukan");
        }
    };

    const toggleScanner = () => {
        if (cameraAvailable === false) {
            alert(
                "Kamera tidak tersedia. Silakan gunakan input manual atau upload gambar barcode."
            );
            setShowScanner(false);
            return;
        }
        setShowScanner((v) => !v);
    };

    const removeFromCart = (productId: number) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-full max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto p-4 z-50
          bg-white rounded-lg shadow-lg
        "
            >
                <DialogHeader>
                    <DialogTitle>Keranjang</DialogTitle>
                </DialogHeader>

                {errorMessage && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-2">
                        {errorMessage}
                    </div>
                )}

                <div className="mb-4 relative w-full max-w-full">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="relative w-full"
                    >
                        <input
                            type="text"
                            aria-label="Cari produk atau scan barcode"
                            placeholder="Cari produk atau masukkan barcode..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            autoComplete="off"
                        />
                        <button
                            type="button"
                            onClick={toggleScanner}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                            aria-label={showScanner ? "Tutup Scanner" : "Buka Scanner"}
                            title={showScanner ? "Tutup Scanner" : "Buka Scanner"}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                    </form>

                    {showScanner && (
                        <div className="mt-4 rounded-md border border-gray-300 overflow-hidden shadow-lg">
                            <BarcodeScanner
                                onDetected={(code: string) => {
                                    const found = products.find(
                                        (p) => p.barcode?.toLowerCase() === code.toLowerCase()
                                    );
                                    if (found) {
                                        onAddProduct(found);
                                        setSearch("");
                                        setShowScanner(false);
                                        setCameraAvailable(true);
                                    } else {
                                        alert("Produk dengan barcode tersebut tidak ditemukan");
                                    }
                                }}
                                onNoCamera={() => {
                                    setCameraAvailable(false);
                                }}
                            />
                        </div>
                    )}

                    {search && (
                        <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded shadow text-sm sm:text-base">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                        onClick={() => {
                                            onAddProduct(product);
                                            setSearch("");
                                        }}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                onAddProduct(product);
                                                setSearch("");
                                            }
                                        }}
                                        role="button"
                                        aria-label={`Tambah produk ${product.nama} ke keranjang`}
                                    >
                                        <span>{product.nama}</span>
                                        <span className="text-gray-600 font-medium">
                                            Rp {product.harga.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 p-2">Produk tidak ditemukan</p>
                            )}
                        </div>
                    )}
                </div>

                {cart.length > 0 ? (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300">
                            <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-left whitespace-nowrap">Produk</th>
                                        <th className="border p-2 text-left whitespace-nowrap">Harga</th>
                                        <th className="border p-2 text-left whitespace-nowrap">Jumlah</th>
                                        <th className="border p-2 text-left whitespace-nowrap">Subtotal</th>
                                        <th className="border p-2 text-left whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.product.id}>
                                            <td className="border p-2 whitespace-nowrap">{item.product.nama}</td>
                                            <td className="border p-2 whitespace-nowrap">
                                                Rp {item.product.harga.toLocaleString("id-ID")}
                                            </td>
                                            <td className="border p-2">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (value > 0) {
                                                            onUpdateQuantity(item.product.id, value);
                                                        }
                                                    }}
                                                    className="w-20"
                                                    aria-label={`Jumlah produk ${item.product.nama}`}
                                                />
                                            </td>
                                            <td className="border p-2 whitespace-nowrap">
                                                Rp {(item.product.harga * item.quantity).toLocaleString("id-ID")}
                                            </td>
                                            <td className="border p-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                    aria-label={`Hapus produk ${item.product.nama} dari keranjang`}
                                                >
                                                    <XMarkIcon className="h-4 w-4" /> {/* ✅ Ganti XIcon ke XMarkIcon */}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 font-semibold text-base gap-4">
                            <span>Total: Rp {total.toLocaleString("id-ID")}</span>
                            <Button onClick={onCheckout} className="w-full sm:w-auto">
                                Checkout
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 mt-4 text-sm sm:text-base text-center">
                        Keranjang kosong
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}