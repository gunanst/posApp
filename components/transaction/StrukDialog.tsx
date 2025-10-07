'use client';

import { TransactionType } from '@/types/type';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

type StrukDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    struk: TransactionType | null;
};

export function StrukDialog({ open, onOpenChange, struk }: StrukDialogProps) {
    const { user } = useAuth();

    if (!struk) return null;

    // Format tanggal dan waktu Indonesia
    const formatDateTime = (date: Date) => {
        return date.toLocaleString('id-ID', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Format waktu saja
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Format tanggal saja
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle className="text-center">Struk Transaksi</DialogTitle>
                </DialogHeader>

                <div className="font-mono text-sm space-y-1 px-4 pb-4">
                    {/* Header Toko */}
                    <div className="text-center mb-2">
                        <p className="font-bold text-lg">TOKO AZKIA</p>
                        <p className="text-xs">Semua ada disini</p>
                        <p className="text-xs">Jl. Merdeka No. 123, Cibubur Jakarta Timur</p>
                        <p className="text-xs">Telp: 191919919191919</p>
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-2"></div>

                    {/* Info Transaksi */}
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>No. Transaksi:</span>
                            <span className="font-semibold">TRX-{struk.id.toString().padStart(6, '0')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tanggal:</span>
                            <span>{formatDate(new Date(struk.createdAt))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu:</span>
                            <span>{formatTime(new Date(struk.createdAt))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kasir:</span>
                            <span className="font-semibold">{user?.username || 'System'}</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-2"></div>

                    {/* Daftar Item */}
                    <div className="space-y-2">
                        <div className="text-center font-semibold text-xs uppercase tracking-wide">
                            Daftar Belanja
                        </div>
                        {struk.items.map((item, index) => (
                            <div key={item.product.id} className="space-y-1">
                                <div className="flex justify-between">
                                    <span className="font-medium">{item.product.nama}</span>
                                    <span>Rp {item.product.harga.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Qty: {item.quantity} x Rp {item.product.harga.toLocaleString('id-ID')}</span>
                                    <span className="font-semibold">
                                        Rp {(item.product.harga * item.quantity).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {index < struk.items.length - 1 && (
                                    <div className="border-t border-dashed border-gray-200"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-2"></div>

                    {/* Total Pembayaran */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-base font-bold">
                            <span>TOTAL:</span>
                            <span>Rp {struk.total.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Jika ada pembayaran dan kembalian */}
                        {struk.paymentAmount && (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span>Bayar:</span>
                                    <span>Rp {struk.paymentAmount.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold">
                                    <span>Kembali:</span>
                                    <span>Rp {(struk.paymentAmount - struk.total).toLocaleString('id-ID')}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-2"></div>

                    {/* Footer */}
                    <div className="text-center space-y-1">
                        <p className="text-xs italic">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
                        <p className="text-xs font-semibold">Terima kasih atas kunjungan Anda!</p>
                        <p className="text-xs text-gray-500">
                            {formatDateTime(new Date(struk.createdAt))}
                        </p>
                    </div>

                    {/* Tombol Print (Opsional) */}
                    <div className="flex justify-center gap-2 mt-4 pt-2 border-t">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.print()}
                            className="text-xs"
                        >
                            🖨️ Print
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-xs"
                        >
                            Tutup
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}