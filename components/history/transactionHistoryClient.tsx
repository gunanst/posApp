'use client';

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    TrendingUp,
    Package,
    DollarSign,
    Filter,
    Download,
    RefreshCw,
    Search
} from "lucide-react";

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
): { period: string; total: number; count: number }[] {
    const map = new Map<string, { total: number; count: number }>();

    transactions.forEach((trx) => {
        const key = keyFunc(trx);
        const prev = map.get(key) || { total: 0, count: 0 };
        map.set(key, {
            total: prev.total + trx.total,
            count: prev.count + 1
        });
    });

    return Array.from(map.entries())
        .map(([period, data]) => ({ period, ...data }))
        .sort((a, b) => (a.period < b.period ? 1 : -1));
}

export default function TransactionHistoryClient({ transactions }: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Set default date range to last 30 days
    useEffect(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);

        if (!startDate) setStartDate(start.toISOString().split('T')[0]);
        if (!endDate) setEndDate(end.toISOString().split('T')[0]);
    }, [startDate, endDate]);

    const filteredTransactions = useMemo(() => {
        let filtered = transactions;

        // Filter by date range
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include entire end date

            filtered = filtered.filter((trx) => {
                const date = new Date(trx.createdAt);
                return date >= start && date <= end;
            });
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((trx) =>
                trx.items.some(item =>
                    item.product.nama.toLowerCase().includes(searchTerm.toLowerCase())
                ) ||
                trx.id.toString().includes(searchTerm)
            );
        }

        return filtered;
    }, [transactions, startDate, endDate, searchTerm]);

    const groupedTotals = useMemo(() => {
        switch (selectedPeriod) {
            case "daily":
                return groupAndSum(filteredTransactions, (trx) =>
                    new Date(trx.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })
                );
            case "weekly":
                return groupAndSum(filteredTransactions, (trx) => {
                    const date = new Date(trx.createdAt);
                    const week = getWeekNumber(date);
                    return `Minggu ${week} - ${date.getFullYear()}`;
                });
            case "monthly":
                return groupAndSum(filteredTransactions, (trx) => {
                    const date = new Date(trx.createdAt);
                    return date.toLocaleString("id-ID", {
                        month: "long",
                        year: "numeric"
                    });
                });
            case "yearly":
                return groupAndSum(filteredTransactions, (trx) =>
                    new Date(trx.createdAt).getFullYear().toString()
                );
            default:
                return [];
        }
    }, [filteredTransactions, selectedPeriod]);

    const totalKeseluruhan = useMemo(() =>
        filteredTransactions.reduce((sum, trx) => sum + trx.total, 0),
        [filteredTransactions]
    );

    const totalItems = useMemo(() =>
        filteredTransactions.reduce(
            (sum, trx) => sum + trx.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
            0
        ),
        [filteredTransactions]
    );

    const periodLabels: Record<PeriodType, string> = {
        daily: "Harian",
        weekly: "Mingguan",
        monthly: "Bulanan",
        yearly: "Tahunan",
    };

    const exportToCSV = () => {
        const headers = ["ID", "Tanggal", "Total", "Jumlah Item"];
        const csvData = filteredTransactions.map(trx => [
            trx.id,
            new Date(trx.createdAt).toLocaleString("id-ID"),
            trx.total,
            trx.items.reduce((sum, item) => sum + item.quantity, 0)
        ]);

        const csvContent = [
            headers.join(","),
            ...csvData.map(row => row.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `laporan-transaksi-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setSearchTerm("");
        setSelectedPeriod("daily");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Riwayat Transaksi
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            Pantau dan analisis performa penjualan toko Anda
                        </p>
                    </div>
                    <Button
                        onClick={exportToCSV}
                        disabled={filteredTransactions.length === 0}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>

                {/* Filter Section */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                            <Filter className="h-5 w-5 text-blue-600" />
                            Filter Laporan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Dari Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border-slate-300 dark:border-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Sampai Tanggal
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border-slate-300 dark:border-slate-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Cari Produk
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                                    <Input
                                        placeholder="Cari produk atau ID transaksi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 border-slate-300 dark:border-slate-600"
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={resetFilters}
                                    className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                        </div>

                        {/* Period Buttons */}
                        <div className="flex flex-wrap gap-2">
                            {(["daily", "weekly", "monthly", "yearly"] as const).map((period) => (
                                <Button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    variant={selectedPeriod === period ? "default" : "outline"}
                                    className={`flex items-center gap-2 transition-all duration-200 ${selectedPeriod === period
                                            ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                                            : "border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    <Calendar className="h-4 w-4" />
                                    {periodLabels[period]}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                        Total Pendapatan
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                                        {formatRupiah(totalKeseluruhan)}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        {filteredTransactions.length} Transaksi
                                    </Badge>
                                </div>
                                <div className="p-2 sm:p-3 bg-blue-500/20 rounded-xl">
                                    <DollarSign className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                        Total Item Terjual
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                                        {totalItems}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        {groupedTotals.length} Periode
                                    </Badge>
                                </div>
                                <div className="p-2 sm:p-3 bg-green-500/20 rounded-xl">
                                    <Package className="h-5 sm:h-6 w-5 sm:w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                        Rata-rata Transaksi
                                    </p>
                                    <p className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                                        {formatRupiah(
                                            filteredTransactions.length > 0
                                                ? totalKeseluruhan / filteredTransactions.length
                                                : 0
                                        )}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                        {periodLabels[selectedPeriod]}
                                    </Badge>
                                </div>
                                <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl">
                                    <TrendingUp className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Period Summary */}
                {groupedTotals.length > 0 && (
                    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Ringkasan {periodLabels[selectedPeriod]}
                                <Badge variant="secondary">
                                    {groupedTotals.length} periode
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {groupedTotals.map(({ period, total, count }) => (
                                    <div
                                        key={period}
                                        className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                                                {count} transaksi
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate mb-2">
                                            {period}
                                        </p>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                            {formatRupiah(total)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Transactions List */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                            <Package className="h-5 w-5 text-orange-600" />
                            Detail Transaksi
                            <Badge variant="secondary" className="ml-2">
                                {filteredTransactions.length} transaksi
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    Tidak ada transaksi
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {startDate && endDate
                                        ? "Tidak ada transaksi dalam rentang tanggal yang dipilih."
                                        : "Pilih rentang tanggal untuk melihat transaksi."
                                    }
                                </p>
                                {(startDate || endDate || searchTerm) && (
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="mt-4"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Reset Filter
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredTransactions.map((trx) => (
                                    <div
                                        key={trx.id}
                                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                    #{trx.id}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                                                        {new Date(trx.createdAt).toLocaleString("id-ID", {
                                                            dateStyle: "medium",
                                                            timeStyle: "short",
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {trx.items.length} item • {trx.items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                                                    {formatRupiah(trx.total)}
                                                </p>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 text-xs mt-1"
                                                >
                                                    Selesai
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {trx.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                                            {item.product.nama}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {formatRupiah(item.product.harga)} × {item.quantity}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs flex-shrink-0 ml-2"
                                                    >
                                                        {formatRupiah(item.product.harga * item.quantity)}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}