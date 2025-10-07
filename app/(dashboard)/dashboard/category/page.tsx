import { getCategories } from "@/lib/actions/categoryAction";
import { Category } from "@/types/type";
import CategoryTable from "@/components/categories/CategoryTable";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default async function CategoryPage() {
    let categories: Category[] = [];
    let error: string | null = null;

    try {
        categories = await getCategories();
    } catch (err) {
        console.error("Gagal Memuat Data", err);
        error = "Gagal memuat data kategori";
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Error State */}
                {error && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-red-800 dark:text-red-300">
                                        Gagal Memuat Data
                                    </p>
                                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                        {error}. Silakan refresh halaman atau coba lagi nanti.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Main Content */}
                <CategoryTable category={categories} />
            </div>
        </div>
    );
}