import { getCategories } from "@/lib/actions/categoryAction"
import { Category } from "@/lib/type"
import CategoryTable from "@/components/categories/CategoryTable"

export default async function CategoryPage() {
    let ambilCategory: Category[] = []
    let error = null
    try {
        ambilCategory = await getCategories()
    } catch (err) {
        console.log('Error Saat Memuat data', err)
        error = "Gagal Memuat Data"
    }
    return (
        <div>
            <div>
                <h1>Daftar Kategori</h1>
                {error && <p className="text-red-500">{error}</p>}
                <CategoryTable category={ambilCategory} />
            </div>
        </div>
    )
}
