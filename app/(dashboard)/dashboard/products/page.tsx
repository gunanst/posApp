import { getProducts } from '@/lib/actions/productAction'
import { getCategories } from '@/lib/actions/categoryAction'
import ProductTable from '@/components/products/ProductTable'
import { Product, Category } from "@/lib/type";

export default async function ProductPage() {
    let ambilData: Product[] = []
    let categories: Category[] = []
    let error = null

    try {
        ambilData = await getProducts()
        categories = await getCategories()
    } catch (err) {
        console.log('Error Memuat Data', err)
        error = "Gagal Memuat Data"
    }

    return (
        <div>
            <h1>Daftar Produk</h1>
            {error && <p className='text-red-500'>{error}</p>}

            {/* kirim juga categories */}
            <ProductTable products={ambilData} categories={categories} />
        </div>
    )
}
