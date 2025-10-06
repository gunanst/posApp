'use client';

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
import Image from 'next/image';

export default function ProductTable({
    products,
    categories,
}: {
    products: Product[];
    categories: Category[];
}) {
    return (
        <div>
            {/* Tombol Create */}
            <div className="flex justify-end mb-4">
                <CreateProductDialog categories={categories} />
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Barcode</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Stok</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>{p.barcode}</TableCell>
                                <TableCell>{p.nama}</TableCell>
                                <TableCell>Rp {p.harga.toLocaleString('id-ID')}</TableCell>
                                <TableCell>{p.stok ?? '-'}</TableCell>
                                <TableCell>{p.Category?.nama || '-'}</TableCell>
                                <TableCell>
                                    {p.image ? (
                                        <div className="relative h-16 w-16 rounded overflow-hidden">
                                            <Image
                                                priority
                                                loading="eager"
                                                src={p.image}
                                                alt={p.nama}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">Tidak ada gambar</span>
                                    )}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <EditProductDialog product={p} categories={categories} />
                                    <form action={deleteProduct}>
                                        <input type="hidden" name="id" value={p.id} />
                                        <Button type="submit" variant="destructive" size="sm">
                                            Hapus
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-4">
                {products.map((p) => (
                    <div
                        key={p.id}
                        className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            {p.image ? (
                                <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                                    <Image
                                        priority
                                        loading="eager"
                                        src={p.image}
                                        alt={p.nama}
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="h-16 w-16 bg-gray-200 flex items-center justify-center rounded">
                                    -
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-semibold">{p.barcode}</span>
                                <span className="font-semibold">{p.nama}</span>
                                <span className="text-sm text-gray-600">Rp {p.harga.toLocaleString('id-ID')}</span>
                                <span className="text-sm text-gray-500">Stok: {p.stok ?? '-'}</span>
                                <span className="text-sm text-gray-500">Kategori: {p.Category?.nama || '-'}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-0">
                            <EditProductDialog product={p} categories={categories} />
                            <form action={deleteProduct}>
                                <input type="hidden" name="id" value={p.id} />
                                <Button type="submit" variant="destructive" size="sm">
                                    Hapus
                                </Button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
