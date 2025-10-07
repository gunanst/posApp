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
  ShieldCheck,
  Star,
  TrendingUp,
  Smartphone,
  Laptop,
  CreditCard,
  Zap,
  CheckCircle,
  ArrowRight,
  Store
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Transaksi Kilat",
      description: "Proses penjualan cepat dengan antarmuka yang intuitif"
    },
    {
      icon: <ScanBarcode className="h-6 w-6" />,
      title: "Scan Barcode",
      description: "Scan produk secara instan dengan kamera device"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analitik Real-time",
      description: "Pantau penjualan dan performa toko secara live"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Manajemen Stok",
      description: "Kelola inventori dengan sistem notifikasi stok rendah"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Multi Pembayaran",
      description: "Dukung cash, QRIS, transfer, dan kartu debit/kredit"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Responsif Mobile",
      description: "Akses dari smartphone, tablet, atau desktop"
    }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      store: "Toko Elektronik Maju Jaya",
      comment: "Sistem ini membuat proses transaksi 3x lebih cepat. Sangat recommended!",
      rating: 5
    },
    {
      name: "Sari Dewi",
      store: "Minimarket Sari Rasa",
      comment: "Fitur laporan otomatis sangat membantu dalam mengambil keputusan bisnis.",
      rating: 5
    },
    {
      name: "Ahmad Fauzi",
      store: "Toko Bangunan Fauzi",
      comment: "Interface yang sederhana tapi powerful. Staff cepat belajar menggunakannya.",
      rating: 4
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Gratis",
      period: "Selamanya",
      description: "Cocok untuk UKM dan toko kecil",
      features: [
        "Hingga 50 transaksi/hari",
        "Manajemen produk dasar",
        "Laporan penjualan harian",
        "Support email"
      ],
      cta: "Mulai Sekarang",
      popular: false
    },
    {
      name: "Professional",
      price: "Rp 299rb",
      period: "/bulan",
      description: "Untuk toko dengan transaksi tinggi",
      features: [
        "Transaksi unlimited",
        "Analitik lengkap",
        "Multi kasir",
        "Backup otomatis",
        "Priority support",
        "Integrasi QRIS"
      ],
      cta: "Coba Gratis 14 Hari",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Rp 799rb",
      period: "/bulan",
      description: "Untuk retail chain dan franchise",
      features: [
        "Semua fitur Professional",
        "Multi cabang",
        "API access",
        "Custom development",
        "Dedicated account manager",
        "Training staff"
      ],
      cta: "Hubungi Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Azkia POS
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sistem Kasir Modern</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <a href="#features" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                Fitur
              </a>
              <a href="#testimonials" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                Testimoni
              </a>
              <a href="#pricing" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors">
                Harga
              </a>
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                  Mulai Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>+500 Toko Telah Menggunakan Azkia POS</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Kelola Toko Lebih
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Mudah & Cepat</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Sistem Point of Sale modern yang membantu Anda mengelola transaksi, stok, dan laporan penjualan dalam satu platform terintegrasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-3 text-lg">
                  Coba Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-600 px-8 py-3 text-lg">
                Lihat Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {[
                { number: "99.9%", label: "Uptime" },
                { number: "3x", label: "Lebih Cepat" },
                { number: "500+", label: "Toko Aktif" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Fitur Unggulan untuk
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Kesuksesan Bisnis Anda</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Dilengkapi dengan segala yang Anda butuhkan untuk mengelola toko secara efisien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Dipercaya oleh
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Ratusan Pelaku Bisnis</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-slate-300"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.store}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Pilih Paket
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Sesuai Kebutuhan</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tidak ada biaya tersembunyi. Upgrade atau downgrade kapan saja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg relative ${plan.popular
                  ? "ring-2 ring-blue-500 scale-105"
                  : "bg-white/80 dark:bg-slate-800/80"
                } backdrop-blur-sm`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Paling Populer
                    </div>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center space-x-1 mt-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                      } text-white`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Siap Mengubah Cara Anda Berbisnis?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Bergabung dengan ratusan toko yang sudah merasakan kemudahan Azkia POS. Tidak perlu kartu kredit untuk memulai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8 py-3 text-lg">
                  Mulai Gratis Sekarang
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-600 px-8 py-3 text-lg">
                Jadwalkan Demo
              </Button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Gratis selamanya untuk hingga 50 transaksi per hari
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">Azkia POS</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sistem kasir modern untuk mengoptimalkan operasional toko Anda.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Produk</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Fitur</a></li>
                <li><a href="#pricing" className="hover:text-blue-600 transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Integrasi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Kontak</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Bantuan</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Dokumentasi</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Azkia POS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}