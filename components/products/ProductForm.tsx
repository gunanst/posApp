"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, ProductFormValues } from "@/app/types/type";
import Image from "next/image";
import BarcodeScanner from "@/components/transaction/BarcodeScanner";
import { SearchIcon } from "lucide-react";

type ProductFormProps = {
    defaultValues?: ProductFormValues;
    categories: Category[];
};

export default function ProductForm({ defaultValues, categories }: ProductFormProps) {
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [barcodeValue, setBarcodeValue] = useState(defaultValues?.barcode ?? "");

    const handleBarcodeDetected = (code: string) => {
        setBarcodeValue(code);
        if (barcodeInputRef.current) {
            barcodeInputRef.current.value = code;
        }

        // Tutup scanner setelah berhasil scan
        setShowScanner(false);

        // 🔊 Bunyi + Getar (backup jika di mobile)
        try {
            if ("vibrate" in navigator) navigator.vibrate(150);
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            oscillator.type = "square";
            oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
            oscillator.connect(audioCtx.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 150);
        } catch {
            // Abaikan error audio di iOS Safari tanpa gesture
        }
    };

    const handleNoCamera = () => {
        alert("Kamera tidak ditemukan. Pastikan izin sudah diberikan dan gunakan HTTPS.");
    };

    return (
        <div className="space-y-4">
            {/* Barcode + Scanner */}
            <div>
                <Label htmlFor="barcode">Kode Barcode</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="barcode"
                        name="barcode"
                        ref={barcodeInputRef}
                        value={barcodeValue}
                        onChange={(e) => setBarcodeValue(e.target.value)}
                        placeholder="Scan atau ketik kode barcode"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowScanner((prev) => !prev)}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                        aria-label="Scan Barcode"
                    >
                        <SearchIcon className="w-4 h-4" />
                    </button>
                </div>

                {showScanner && (
                    <div className="mt-4">
                        <BarcodeScanner
                            onDetected={handleBarcodeDetected}
                            onNoCamera={handleNoCamera}
                        />
                    </div>
                )}
            </div>

            {/* Nama */}
            <div>
                <Label htmlFor="nama">Nama Produk</Label>
                <Input
                    id="nama"
                    name="nama"
                    defaultValue={defaultValues?.nama ?? ""}
                    placeholder="Masukkan nama produk"
                    required
                />
            </div>

            {/* Harga */}
            <div>
                <Label htmlFor="harga">Harga</Label>
                <Input
                    id="harga"
                    name="harga"
                    type="number"
                    defaultValue={defaultValues?.harga?.toString() ?? ""}
                    placeholder="Masukkan harga produk"
                    required
                />
            </div>

            {/* Stok */}
            <div>
                <Label htmlFor="stok">Stok</Label>
                <Input
                    id="stok"
                    name="stok"
                    type="number"
                    defaultValue={defaultValues?.stok?.toString() ?? ""}
                    placeholder="Masukkan stok produk"
                    required
                />
            </div>

            {/* Kategori */}
            <div>
                <Label htmlFor="categoryId">Kategori</Label>
                <select
                    id="categoryId"
                    name="categoryId"
                    defaultValue={defaultValues?.categoryId?.toString() ?? ""}
                    className="border p-2 w-full rounded"
                    required
                >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nama}
                        </option>
                    ))}
                </select>
            </div>

            {/* Upload Gambar */}
            <div>
                <Label htmlFor="image">Gambar Produk</Label>
                <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                />
                {defaultValues?.image && (
                    <div className="relative h-16 w-16 rounded overflow-hidden mt-2 border">
                        <Image
                            src={defaultValues.image}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
