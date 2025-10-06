"use client";

import { useState } from "react";
import { CartItem, Product } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XMarkIcon, CameraIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import BarcodeScanner from "@/components/transaction/BarcodeScanner";

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
    const [scannedCode, setScannedCode] = useState<string | null>(null);

    const filteredProducts = products.filter(
        (p) =>
            p.nama.toLowerCase().includes(search.toLowerCase()) ||
            p.barcode?.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ Fungsi getar + beep
    const feedback = () => {
        if ("vibrate" in navigator) navigator.vibrate(150);
        try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.type = "square";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            setTimeout(() => osc.stop(), 150);
        } catch { }
    };

    const handleSubmit = () => {
        const code = search.trim().toLowerCase();
        if (!code) return;

        const found = products.find(
            (p) =>
                p.barcode?.toLowerCase() === code || p.nama.toLowerCase().includes(code)
        );

        if (found) {
            onAddProduct(found);
            feedback();
            setScannedCode(found.nama);
            setTimeout(() => setScannedCode(null), 2000);
            setSearch("");
            setShowScanner(false);
        } else {
            alert("Produk tidak ditemukan");
        }
    };

    const toggleScanner = () => {
        if (cameraAvailable === false) {
            alert("Kamera tidak tersedia. Gunakan input manual atau upload gambar barcode.");
            setShowScanner(false);
            return;
        }
        setShowScanner((v) => !v);
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    w-full max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto p-4 z-50
                    bg-white rounded-lg shadow-lg"
            >
                <DialogHeader>
                    <DialogTitle>Keranjang</DialogTitle>
                </DialogHeader>

                {errorMessage && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-2">
                        {errorMessage}
                    </div>
                )}

                {/* 🔍 Input Cari Produk */}
                <div className="mb-4 relative w-full max-w-full">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="relative w-full"
                    >
                        <Input
                            type="text"
                            aria-label="Cari produk atau scan barcode"
                            placeholder="Cari produk atau masukkan barcode..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pr-10"
                            autoComplete="off"
                        />
                        <button
                            type="button"
                            onClick={toggleScanner}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
                            aria-label={showScanner ? "Tutup Scanner" : "Buka Scanner"}
                            title={showScanner ? "Tutup Scanner" : "Buka Scanner"}
                        >
                            {showScanner ? (
                                <CameraIcon className="h-5 w-5" />
                            ) : (
                                <MagnifyingGlassIcon className="h-5 w-5" />
                            )}
                        </button>
                    </form>

                    {/* 🧾 Hasil pencarian manual */}
                    {search && filteredProducts.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded shadow">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                    onClick={() => {
                                        onAddProduct(product);
                                        feedback();
                                        setScannedCode(product.nama);
                                        setTimeout(() => setScannedCode(null), 2000);
                                        setSearch("");
                                    }}
                                >
                                    <span>{product.nama}</span>
                                    <span className="text-gray-600 font-medium">
                                        Rp {product.harga.toLocaleString("id-ID")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 🎦 Scanner Kamera */}
                    {showScanner && (
                        <div className="mt-4 border rounded-lg overflow-hidden relative">
                            <BarcodeScanner
                                onDetected={(code: string) => {
                                    if (!code) return;
                                    const found = products.find(
                                        (p) => p.barcode?.toLowerCase() === code.toLowerCase()
                                    );
                                    if (found) {
                                        onAddProduct(found);
                                        feedback();
                                        setScannedCode(found.nama);
                                        setTimeout(() => setScannedCode(null), 2000);
                                        setSearch("");
                                        setShowScanner(false);
                                        setCameraAvailable(true);
                                    } else {
                                        alert("Produk dengan barcode tersebut tidak ditemukan.");
                                    }
                                }}
                                onNoCamera={() => {
                                    setCameraAvailable(false);
                                }}
                            />

                            <button
                                type="button"
                                onClick={() => setShowScanner(false)}
                                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Feedback hasil scan */}
                    {scannedCode && (
                        <p className="text-green-600 text-sm mt-2 text-center animate-pulse">
                            ✅ {scannedCode} ditambahkan ke keranjang
                        </p>
                    )}
                </div>

                {/* 🛒 Daftar Keranjang */}
                {cart.length > 0 ? (
                    <>
                        <div className="overflow-x-auto rounded-md border border-gray-300">
                            <table className="w-full text-sm border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2 text-left">Produk</th>
                                        <th className="border p-2 text-left">Harga</th>
                                        <th className="border p-2 text-left">Jumlah</th>
                                        <th className="border p-2 text-left">Subtotal</th>
                                        <th className="border p-2 text-left">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item) => (
                                        <tr key={item.product.id}>
                                            <td className="border p-2">{item.product.nama}</td>
                                            <td className="border p-2">
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
                                                />
                                            </td>
                                            <td className="border p-2">
                                                Rp {(item.product.harga * item.quantity).toLocaleString("id-ID")}
                                            </td>
                                            <td className="border p-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <XMarkIcon className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 font-semibold gap-4">
                            <span>Total: Rp {total.toLocaleString("id-ID")}</span>
                            <Button onClick={onCheckout} className="w-full sm:w-auto">
                                Checkout
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 mt-4 text-center">Keranjang kosong</p>
                )}
            </DialogContent>
        </Dialog>
    );
}
