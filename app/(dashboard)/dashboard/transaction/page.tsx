import { getProducts } from '@/lib/actions/transactionAction';
import POS from '@/components/transaction/POS';
export const dynamic = 'force-dynamic';

export default async function TransactionPage() {
    const products = await getProducts();

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Kasir</h1>
            <POS products={products} />
        </div>
    );
}
