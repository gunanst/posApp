'use client';

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, ProductFormValues } from "@/lib/type";
import Image from "next/image";
import BarcodeScanner from "@/components/transaction/BarcodeScanner";
import { SearchIcon } from "lucide-react"; // ✅ Tambahkan ini

type ProductFormProps = {
    defaultValues?: ProductFormValues;
    categories: Category[];
};

export default function ProductForm({ defaultValues, categories }: ProductFormProps) {
    const barcodeInputRef = useRef<HTMLInputElement>(null);
    const [showScanner, setShowScanner] = useState(false);

    const handleBarcodeDetected = (code: string) => {
        if (barcodeInputRef.current) {
            barcodeInputRef.current.value = code;
        }
        setShowScanner(false);
    };

    const handleNoCamera = () => {
        console.warn("Kamera tidak tersedia.");
    };

    return (
        <div className="space-y-4">
            {/* Barcode + Scanner */}
            <div>
                <Label htmlFor="barcode">Barcode</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="barcode"
                        name="barcode"
                        defaultValue={defaultValues?.barcode ?? ""}
                        ref={barcodeInputRef}
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
                <Label htmlFor="nama">Nama</Label>
                <Input
                    id="nama"
                    name="nama"
                    defaultValue={defaultValues?.nama ?? ""}
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
                    <div className="relative h-16 w-16 rounded overflow-hidden mt-2">
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
