import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  ScanBarcode,
  Receipt,
  Clock,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const quickActions = [
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Transaksi Baru",
      description: "Mulai transaksi penjualan baru",
      href: "/dashboard/transaction",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Kelola Produk",
      description: "Tambah atau edit produk",
      href: "/dashboard/products",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Lihat Laporan",
      description: "Analisis penjualan harian",
      href: "/dashboard/history",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: <ScanBarcode className="h-6 w-6" />,
      title: "Scan Barcode",
      description: "Scan produk dengan kamera",
      href: "/dashboard/transaction?scan=true",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  const stats = [
    {
      label: "Transaksi Hari Ini",
      value: "24",
      change: "+12%",
      icon: <Receipt className="h-4 w-4" />,
      color: "text-blue-600"
    },
    {
      label: "Produk Terjual",
      value: "156",
      change: "+8%",
      icon: <Package className="h-4 w-4" />,
      color: "text-green-600"
    },
    {
      label: "Pendapatan",
      value: "Rp 8.4JT",
      change: "+15%",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "text-purple-600"
    },
    {
      label: "Rata-rata Waktu",
      value: "2.3m",
      change: "-5%",
      icon: <Clock className="h-4 w-4" />,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TOKO AZKIA
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sistem Kasir Toko</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Selamat Datang</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Admin Toko</p>
              </div>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                  Masuk Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Selamat Datang di Toko Azkia
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Sistem Point of Sale untuk mengelola transaksi dan inventori toko Anda
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Akses Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Aktivitas Terbaru</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "10:30", action: "Transaksi #TRX-0012", amount: "Rp 450.000" },
                  { time: "10:15", action: "Produk ditambahkan", amount: "Speaker JBL" },
                  { time: "09:45", action: "Transaksi #TRX-0011", amount: "Rp 320.000" },
                  { time: "09:20", action: "Stok diperbarui", amount: "Air Mineral" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{activity.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5" />
                <span>Status Sistem</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: "Server Database", status: "Online", color: "bg-green-500" },
                  { service: "API Transaksi", status: "Online", color: "bg-green-500" },
                  { service: "Scanner Barcode", status: "Online", color: "bg-green-500" },
                  { service: "Backup Data", status: "Aktif", color: "bg-blue-500" },
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <span className="font-medium text-sm">{system.service}</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 ${system.color} rounded-full`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{system.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300 mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-semibold text-sm">Tips Hari Ini</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Gunakan fitur scan barcode untuk mempercepat proses transaksi. Pastikan stok selalu diperbarui untuk menghindari kehabisan produk.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <ShoppingCart className="h-3 w-3 text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Toko Azkia</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sistem Kasir Modern • {new Date().getFullYear()} • Versi 1.0
          </p>
        </div>
      </div>
    </div>
  );
}