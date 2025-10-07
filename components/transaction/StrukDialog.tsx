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

    // Format yang lebih compact untuk mobile
    const formatDateTime = (date: Date) => {
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-white border-2 border-gray-300 shadow-2xl mx-4 print:shadow-none print:border-0">
                <DialogHeader className="p-4 pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white print:bg-white print:bg-none">
                    <DialogTitle className="text-center text-white print:text-black">
                        STRUK TRANSAKSI
                    </DialogTitle>
                </DialogHeader>

                <div className="font-mono text-sm space-y-1 px-4 pb-4 bg-white print:bg-white">
                    {/* Header Toko - Compact untuk mobile */}
                    <div className="text-center mb-3 pt-2">
                        <p className="font-bold text-base tracking-tight">TOKO AZKIA</p>
                        <p className="text-[10px] text-gray-600 mt-1">Semua Ada Disini</p>
                        <p className="text-[10px] text-gray-600">Jl. Merdeka No. 123, Cibubur</p>
                        <p className="text-[10px] text-gray-600">Telp: 191919919191919</p>
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-2"></div>

                    {/* Info Transaksi - Compact */}
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-600">No. Transaksi:</span>
                            <span className="font-bold">TRX-{struk.id.toString().padStart(6, '0')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tanggal:</span>
                            <span>{formatDate(new Date(struk.createdAt))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Waktu:</span>
                            <span>{formatTime(new Date(struk.createdAt))}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Kasir:</span>
                            <span className="font-semibold">{user?.username || 'System'}</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-2"></div>

                    {/* Daftar Item - Optimized untuk mobile */}
                    <div className="space-y-2">
                        <div className="text-center font-semibold text-xs uppercase tracking-wide text-gray-700 bg-gray-100 py-1 -mx-4 px-4">
                            Daftar Belanja
                        </div>
                        {struk.items.map((item, index) => (
                            <div key={item.product.id} className="space-y-1 py-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium text-xs block truncate">
                                            {item.product.nama}
                                        </span>
                                        <span className="text-[10px] text-gray-600 block">
                                            {item.quantity} x Rp {item.product.harga.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-xs whitespace-nowrap ml-2">
                                        Rp {(item.product.harga * item.quantity).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {index < struk.items.length - 1 && (
                                    <div className="border-t border-dashed border-gray-200 mt-1"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-2"></div>

                    {/* Total Pembayaran */}
                    <div className="space-y-2 bg-gray-50 -mx-4 px-4 py-3">
                        <div className="flex justify-between text-sm font-bold">
                            <span>TOTAL:</span>
                            <span>Rp {struk.total.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Jika ada pembayaran dan kembalian */}
                        {struk.paymentAmount && (
                            <>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600">Bayar:</span>
                                    <span>Rp {struk.paymentAmount.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold border-t border-dashed border-gray-300 pt-1">
                                    <span>Kembali:</span>
                                    <span className="text-green-600">
                                        Rp {(struk.paymentAmount - struk.total).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-400 my-2"></div>

                    {/* Footer */}
                    <div className="text-center space-y-2 py-2">
                        <p className="text-[10px] italic text-gray-600 leading-tight">
                            Barang yang sudah dibeli tidak dapat ditukar/dikembalikan
                        </p>
                        <p className="text-xs font-semibold text-gray-800">
                            Terima kasih atas kunjungan Anda!
                        </p>
                        <p className="text-[10px] text-gray-500">
                            {formatDateTime(new Date(struk.createdAt))}
                        </p>
                    </div>

                    {/* Tombol Aksi - Hidden saat print */}
                    <div className="flex justify-center gap-3 mt-4 pt-3 border-t border-gray-300 no-print">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.print()}
                            className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                            🖨️ Print
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            Tutup
                        </Button>
                    </div>

                    {/* Watermark untuk print */}
                    <div className="hidden print:block text-center mt-4">
                        <p className="text-[8px] text-gray-400">
                            Dicetak dari Azkia POS - {formatDateTime(new Date())}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}