'use client';

import { useState, useMemo } from "react";

type Product = {
    nama: string;
    harga: number;
};

type TransactionItem = {
    id: number;
    quantity: number;
    product: Product;
};

type Transaction = {
    id: number;
    createdAt: Date;
    total: number;
    items: TransactionItem[];
};

type PeriodType = "daily" | "weekly" | "monthly" | "yearly";

type Props = {
    transactions: Transaction[];
};

function formatRupiah(num: number) {
    return "Rp " + num.toLocaleString("id-ID");
}

function getWeekNumber(d: Date) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function groupAndSum(
    transactions: Transaction[],
    keyFunc: (trx: Transaction) => string
): { period: string; total: number }[] {
    const map = new Map<string, number>();

    transactions.forEach((trx) => {
        const key = keyFunc(trx);
        const prev = map.get(key) || 0;
        map.set(key, prev + trx.total);
    });

    return Array.from(map.entries())
        .map(([period, total]) => ({ period, total }))
        .sort((a, b) => (a.period < b.period ? 1 : -1));
}

export default function TransactionHistoryClient({ transactions }: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const filteredTransactions = useMemo(() => {
        if (!startDate || !endDate) return [];

        const start = new Date(startDate);
        const end = new Date(endDate);

        return transactions.filter((trx) => {
            const date = new Date(trx.createdAt);
            return date >= start && date <= end;
        });
    }, [transactions, startDate, endDate]);

    const groupedTotals = useMemo(() => {
        switch (selectedPeriod) {
            case "daily":
                return groupAndSum(filteredTransactions, (trx) =>
                    new Date(trx.createdAt).toLocaleDateString("id-ID")
                );
            case "weekly":
                return groupAndSum(filteredTransactions, (trx) => {
                    const date = new Date(trx.createdAt);
                    const week = getWeekNumber(date);
                    return `${date.getFullYear()} - Minggu ke-${week}`;
                });
            case "monthly":
                return groupAndSum(filteredTransactions, (trx) => {
                    const date = new Date(trx.createdAt);
                    return `${date.getFullYear()} - ${date.toLocaleString("id-ID", {
                        month: "long",
                    })}`;
                });
            case "yearly":
                return groupAndSum(filteredTransactions, (trx) =>
                    new Date(trx.createdAt).getFullYear().toString()
                );
            default:
                return [];
        }
    }, [filteredTransactions, selectedPeriod]);

    const totalKeseluruhan = filteredTransactions.reduce(
        (sum, trx) => sum + trx.total,
        0
    );

    const periodLabels: Record<PeriodType, string> = {
        daily: "Per Hari",
        weekly: "Per Minggu",
        monthly: "Per Bulan",
        yearly: "Per Tahun",
    };

    return (
        <div className="w-full mx-auto p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">History Transaksi</h1>

            {/* Filter Rentang Tanggal & Periode */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:flex-wrap">
                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700">Dari Tanggal:</label>
                    <input
                        type="date"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-auto">
                    <label className="block text-sm font-medium text-gray-700">Sampai Tanggal:</label>
                    <input
                        type="date"
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {(["daily", "weekly", "monthly", "yearly"] as const).map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-3 py-2 rounded-md text-sm font-semibold transition ${selectedPeriod === period
                                    ? "bg-indigo-600 text-white shadow"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {periodLabels[period]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ringkasan */}
            {startDate && endDate && (
                <div className="mb-6 p-4 bg-white rounded-md shadow border text-sm">
                    <p className="text-gray-500">{periodLabels[selectedPeriod]}:</p>
                    <p className="text-lg font-semibold text-indigo-700">
                        Total Transaksi: {formatRupiah(totalKeseluruhan)}
                    </p>
                    <p className="text-gray-600 mt-1">
                        Menampilkan {filteredTransactions.length} transaksi dari {startDate} sampai {endDate}
                    </p>
                </div>
            )}

            {/* Grafik Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {groupedTotals.map(({ period, total }) => (
                    <div
                        key={period}
                        className="p-4 bg-white rounded-md shadow border flex flex-col text-sm"
                    >
                        <span className="text-gray-500 mb-1">{periodLabels[selectedPeriod]}</span>
                        <span className="text-indigo-700 font-medium truncate">{period}</span>
                        <span className="mt-auto text-xl font-bold">{formatRupiah(total)}</span>
                    </div>
                ))}
            </div>

            {/* Tabel Transaksi */}
            <div className="overflow-x-auto border border-gray-200 rounded-md shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Tanggal</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Items</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-4 text-gray-500">
                                    Tidak ada transaksi dalam rentang tanggal.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {new Date(trx.createdAt).toLocaleString("id-ID", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-indigo-700">
                                        {formatRupiah(trx.total)}
                                    </td>
                                    <td className="px-4 py-3 max-w-xs">
                                        <ul className="list-disc list-inside space-y-1">
                                            {trx.items.map((item) => (
                                                <li key={item.id} className="truncate">
                                                    {item.product.nama} - Qty: {item.quantity} - Harga:{" "}
                                                    {formatRupiah(item.product.harga)}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
