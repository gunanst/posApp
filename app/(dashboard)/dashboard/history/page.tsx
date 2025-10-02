import { getTransactionHistory } from "@/lib/actions/transactionHistoryActions";
import TransactionHistoryClient from "@/components/history/transactionHistoryClient";

export default async function TransactionHistoryPage() {
    const transactions = await getTransactionHistory();

    return <TransactionHistoryClient transactions={transactions} />;
}
