import { getTransactionHistory } from "@/lib/actions/transactionHistoryActions";
import TransactionHistoryClient from "@/components/history/transactionHistoryClient"

export const dynamic = 'force-dynamic';
export default async function TransactionHistoryPage() {
    try {
        const transactions = await getTransactionHistory();

        return <TransactionHistoryClient transactions={transactions} />;
    } catch (error) {
        console.error('Error loading transaction history:', error);
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Gagal Memuat Data
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Terjadi kesalahan saat memuat riwayat transaksi. Silakan refresh halaman.
                    </p>
                </div>
            </div>
        );
    }
}