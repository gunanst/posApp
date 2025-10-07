// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Truck,
  Star,
  Clock,
  Shield,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  Search,
  Menu,
  X,
  ChevronRight,
  CheckCircle
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    {
      name: "Elektronik Rumah Tangga",
      image: "🛋️",
      items: ["Kipas Angin", "Blender", "Microwave", "Rice Cooker"]
    },
    {
      name: "Perlengkapan Dapur",
      image: "🔪",
      items: ["Peralatan Masak", "Piring & Gelas", "Termos", "Tempat Penyimpanan"]
    },
    {
      name: "Kebutuhan Harian",
      image: "🏠",
      items: ["Sabun", "Shampoo", "Pasta Gigi", "Detergen"]
    },
    {
      name: "Makanan & Minuman",
      image: "🍚",
      items: ["Beras", "Minyak Goreng", "Bumbu Dapur", "Snack"]
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Beras Premium 5kg",
      price: 65000,
      originalPrice: 75000,
      image: "🍚",
      category: "Makanan Pokok",
      rating: 4.8
    },
    {
      id: 2,
      name: "Minyak Goreng 2L",
      price: 28000,
      originalPrice: 32000,
      image: "🛢️",
      category: "Bahan Masak",
      rating: 4.6
    },
    {
      id: 3,
      name: "Blender Philips",
      price: 450000,
      originalPrice: 520000,
      image: "⚡",
      category: "Elektronik",
      rating: 4.9
    },
    {
      id: 4,
      name: "Set Peralatan Masak",
      price: 185000,
      originalPrice: 220000,
      image: "🍳",
      category: "Dapur",
      rating: 4.7
    }
  ];

  const services = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Gratis Ongkir",
      description: "Gratis pengiriman untuk pembelian di atas Rp 100.000"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Buka 24 Jam",
      description: "Melayani kebutuhan Anda kapan saja"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Garansi Produk",
      description: "Jaminan kualitas dan kepuasan pelanggan"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Harga Terbaik",
      description: "Harga kompetitif dengan kualitas terjamin"
    }
  ];

  const testimonials = [
    {
      name: "Ibu Sari",
      location: "Cibubur",
      comment: "Barang lengkap dan harganya terjangkau. Pelayanannya juga ramah!",
      rating: 5
    },
    {
      name: "Budi Santoso",
      location: "Jakarta Timur",
      comment: "Toko langganan keluarga sejak 5 tahun. Terpercaya dan berkualitas.",
      rating: 5
    },
    {
      name: "Dewi Anggraeni",
      location: "Cisalak",
      comment: "Produk fresh dan lengkap. Gratis ongkir juga, sangat membantu!",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header & Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Toko Azkia</h1>
                <p className="text-sm text-gray-600">Kebutuhan Rumah Tangga Lengkap</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 font-medium">Beranda</a>
              <a href="#products" className="text-gray-700 hover:text-green-600 font-medium">Produk</a>
              <a href="#categories" className="text-gray-700 hover:text-green-600 font-medium">Kategori</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 font-medium">Tentang Kami</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium">Kontak</a>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" className="border-gray-300">
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Admin POS
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-green-600 font-medium">Beranda</a>
                <a href="#products" className="text-gray-700 hover:text-green-600 font-medium">Produk</a>
                <a href="#categories" className="text-gray-700 hover:text-green-600 font-medium">Kategori</a>
                <a href="#about" className="text-gray-700 hover:text-green-600 font-medium">Tentang Kami</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium">Kontak</a>
                <div className="pt-4 border-t">
                  <Link href="/dashboard">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Admin POS
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-green-50 to-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-green-700 mb-6">
                <Star className="h-4 w-4 fill-current" />
                <span>Terpercaya Sejak 2010</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Semua Kebutuhan
                <span className="text-green-600 block">Rumah Tangga Anda</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Menyediakan berbagai macam kebutuhan rumah tangga dengan kualitas terbaik dan harga terjangkau.
                Dari bahan makanan hingga elektronik rumah tangga, semua ada di Toko Azkia.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  Belanja Sekarang
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300 px-8 py-3 text-lg">
                  Lihat Katalog
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Produk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">10K+</div>
                  <div className="text-sm text-gray-600">Pelanggan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">13+</div>
                  <div className="text-sm text-gray-600">Tahun</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">🍚</div>
                    <div className="font-semibold text-green-800">Bahan Pokok</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">🛢️</div>
                    <div className="font-semibold text-blue-800">Bahan Masak</div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">🍳</div>
                    <div className="font-semibold text-orange-800">Peralatan</div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <div className="font-semibold text-purple-800">Elektronik</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-green-600">
                    {service.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kategori Produk
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan semua kebutuhan rumah tangga Anda dalam berbagai kategori
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{category.image}</div>
                  <h3 className="font-semibold text-gray-900 mb-3">{category.name}</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produk Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Produk terbaik dengan harga spesial untuk Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{product.image}</div>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                            }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-green-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Tambah Keranjang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kata Pelanggan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dengarkan pengalaman langsung dari pelanggan setia Toko Azkia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tentang Toko Azkia
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Sejak tahun 2010, Toko Azkia telah menjadi pilihan terpercaya masyarakat
                untuk memenuhi berbagai kebutuhan rumah tangga. Kami berkomitmen
                menyediakan produk berkualitas dengan harga terjangkau.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Produk berkualitas dengan harga kompetitif</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Pelayanan ramah dan profesional</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Gratis ongkir untuk area sekitar</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Buka 24 jam untuk kenyamanan Anda</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-8 text-white text-center">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold mb-4">Kunjungi Toko Kami</h3>
              <p className="mb-6">Jl. Merdeka No. 123, Cibubur<br />Jakarta Timur</p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="h-4 w-4 mr-2" />
                  Telepon
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <MapPin className="h-4 w-4 mr-2" />
                  Maps
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg">Toko Azkia</span>
              </div>
              <p className="text-gray-400 text-sm">
                Menyediakan berbagai kebutuhan rumah tangga dengan kualitas terbaik sejak 2010.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Jl. Merdeka No. 123, Cibubur</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(021) 1234-5678</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Buka 24 Jam</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#products" className="hover:text-white transition-colors">Produk</a></li>
                <li><a href="#categories" className="hover:text-white transition-colors">Kategori</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Tentang Kami</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Follow Kami</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Toko Azkia. All rights reserved. |
              <Link href="/dashboard" className="ml-2 text-green-400 hover:text-green-300">
                Admin POS
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}