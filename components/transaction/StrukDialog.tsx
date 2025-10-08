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
            <DialogContent className="w-[95vw] max-w-[320px] p-0 overflow-hidden bg-white border border-gray-200 shadow-xl mx-auto print:shadow-none print:border-0 print:max-w-[80mm]">
                <DialogHeader className="p-3 pb-1 bg-gradient-to-r from-green-600 to-blue-600 text-white print:bg-white print:bg-none">
                    <DialogTitle className="text-center text-white print:text-black text-sm font-bold">
                        STRUK TRANSAKSI
                    </DialogTitle>
                </DialogHeader>

                <div className="font-mono text-[11px] space-y-0.5 px-3 pb-3 bg-white print:bg-white">
                    {/* Header Toko - Super compact untuk mobile */}
                    <div className="text-center mb-2 pt-1">
                        <p className="font-bold text-sm tracking-tight">Toko Azka</p>
                        <p className="text-[9px] text-gray-600 mt-0.5">Kebutuhan Rumah Tangga</p>
                        <p className="text-[9px] text-gray-600">Jl. Merdeka No. 123, Cibubur</p>
                        <p className="text-[9px] text-gray-600">Telp: 191919919191919</p>
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-1.5"></div>

                    {/* Info Transaksi - Ultra compact */}
                    <div className="space-y-0.5 text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-gray-600">No. TRX:</span>
                            <span className="font-bold">#{struk.id.toString().padStart(6, '0')}</span>
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
                        {struk.paymentMethod && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Metode:</span>
                                <span className="font-semibold">
                                    {struk.paymentMethod === 'CASH' && 'Cash'}
                                    {struk.paymentMethod === 'QRIS' && 'QRIS'}
                                    {struk.paymentMethod === 'DEBIT' && 'Debit'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-1.5"></div>

                    {/* Daftar Item - Super optimized untuk mobile */}
                    <div className="space-y-1">
                        <div className="text-center font-semibold text-[10px] uppercase tracking-wide text-gray-700 bg-gray-100 py-1 -mx-3 px-3">
                            DAFTAR BELANJA
                        </div>
                        {struk.items.map((item, index) => (
                            <div key={item.product.id} className="py-0.5">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <span className="font-medium text-[10px] block truncate leading-tight">
                                            {item.product.nama}
                                        </span>
                                        <span className="text-[9px] text-gray-600 block leading-tight">
                                            {item.quantity} x @Rp {item.product.harga.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-[10px] whitespace-nowrap leading-tight">
                                        Rp {(item.product.harga * item.quantity).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                {index < struk.items.length - 1 && (
                                    <div className="border-t border-dashed border-gray-200 mt-0.5"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-1.5"></div>

                    {/* Total Pembayaran */}
                    <div className="space-y-1 bg-gray-50 -mx-3 px-3 py-2">
                        <div className="flex justify-between text-[11px] font-bold">
                            <span>TOTAL:</span>
                            <span>Rp {struk.total.toLocaleString('id-ID')}</span>
                        </div>

                        {/* Jika ada pembayaran dan kembalian */}
                        {struk.paymentAmount && (
                            <>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-gray-600">Bayar:</span>
                                    <span>Rp {struk.paymentAmount.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold border-t border-dashed border-gray-300 pt-0.5">
                                    <span>Kembali:</span>
                                    <span className="text-green-600">
                                        Rp {(struk.paymentAmount - struk.total).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-1.5"></div>

                    {/* Footer */}
                    <div className="text-center space-y-1 py-1">
                        <p className="text-[9px] italic text-gray-600 leading-tight">
                            Barang sudah dibeli tidak dapat ditukar/dikembalikan
                        </p>
                        <p className="text-[10px] font-semibold text-gray-800">
                            Terima kasih atas kunjungan Anda!
                        </p>
                        <p className="text-[9px] text-gray-500">
                            {formatDateTime(new Date(struk.createdAt))}
                        </p>
                    </div>

                    {/* Tombol Aksi - Compact untuk mobile */}
                    <div className="flex justify-center gap-2 mt-3 pt-2 border-t border-gray-200 no-print">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.print()}
                            className="text-[10px] h-7 px-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                            🖨️ Print
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-[10px] h-7 px-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                        >
                            Tutup
                        </Button>
                    </div>

                    {/* Watermark untuk print */}
                    <div className="hidden print:block text-center mt-2">
                        <p className="text-[8px] text-gray-400">
                            Dicetak dari Toko Azka- {formatDateTime(new Date())}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}