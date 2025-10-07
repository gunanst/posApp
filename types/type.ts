export type Category = {
    id: number;
    nama: string;
};

export type Product = {
    id: number;
    barcode: string | null;
    nama: string;
    harga: number;
    stok: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null; // ← tambahkan ini!
    categoryId: number | null;
    image: string | null;
    Category?: Category | null;
};

// 🔥 khusus untuk form input (tidak pakai Date, tidak pakai relasi langsung)
export type ProductFormValues = {
    id?: number;
    barcode: string | null;
    nama: string;
    harga: number;
    stok: number | null;
    categoryId?: number | null;
    image?: string | null;
};

export type TransactionItem = {
    id: number;
    productId: number;
    product: Product;
    quantity: number;
    items: number;
};

export type Transaction = {
    id: number;
    createdAt: Date;
    total: number;
    items: TransactionItem[];
};

export type CartItem = {
    product: Product;
    quantity: number;
};

export type TransactionType = {
    id: number;
    total: number;
    createdAt: Date;
    paymentAmount?: number;
    paymentMethod?: 'CASH' | 'QRIS' | 'DEBIT';
    items: {
        product: Product;
        quantity: number;
    }[];
};

export type CategoryFormProps = {
    defaultValues?: Partial<Category>;
};

export type User = {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'KASIR';
    createdAt: Date;
    updatedAt: Date;
};

export type LoginFormData = {
    username: string;
    password: string;
};

export type AuthUser = {
    id: number;
    username: string;
    email: string;
    role: 'ADMIN' | 'KASIR';
};

export type JWTPayload = {
    userId: number;
    username: string;
    role: 'ADMIN' | 'KASIR';
    iat?: number;
    exp?: number;
};
