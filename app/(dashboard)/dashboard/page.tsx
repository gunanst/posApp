import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
                Selamat datang di panel admin. Pilih menu di sidebar untuk mulai.
            </p>

            {/* Ringkasan statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Produk</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">120</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Kategori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">8</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">25</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
