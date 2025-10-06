'use client';

import { TransactionType } from '@/app/types/type';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type StrukDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    struk: TransactionType | null;
};

export function StrukDialog({ open, onOpenChange, struk }: StrukDialogProps) {
    if (!struk) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-4">
                <DialogHeader>
                    <DialogTitle>Struk Transaksi #{struk.id}</DialogTitle>
                </DialogHeader>

                <div className="font-mono text-sm space-y-2 mt-2">
                    <div className="text-center">
                        <p>MiniMart ABC</p>
                        <p>Jl. Contoh No.123</p>
                        <p>Telp: 0812-3456-7890</p>
                    </div>
                    <hr />
                    {struk.items.map(item => (
                        <div key={item.product.id} className="flex justify-between">
                            <span>{item.product.nama} x {item.quantity}</span>
                            <span>Rp {(item.product.harga * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                    ))}
                    <hr />
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>Rp {struk.total.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-1">{struk.createdAt.toLocaleString('id-ID')}</div>
                    <hr className="my-1" />
                    <div className="text-center text-xs">Terima kasih telah berbelanja!</div>
                    <div className="flex justify-center mt-2">
                        <Button size="sm" onClick={() => onOpenChange(false)}>Tutup</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
