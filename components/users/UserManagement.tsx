'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    User,
    Shield,
    Mail,
    Calendar
} from 'lucide-react';
import { createUser } from '@/lib/actions/authActions';
import { User as UserType } from '@/types/type';

interface UserManagementProps { }

export default function UserManagement({ }: UserManagementProps) {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Fetch users (you'll need to create this server action)
    const fetchUsers = async () => {
        try {
            setLoading(true);
            // This will be implemented in the next step
            const response = await fetch('/api/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateUser = async (formData: FormData) => {
        setIsSubmitting(true);
        setError('');

        try {
            const result = await createUser(formData);

            if (result.success) {
                setIsDialogOpen(false);
                fetchUsers(); // Refresh the list
                // Reset form
                const form = document.getElementById('create-user-form') as HTMLFormElement;
                form?.reset();
            } else {
                setError(result.error || 'Gagal membuat user');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat membuat user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleBadge = (role: string) => {
        if (role === 'ADMIN') {
            return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Admin</Badge>;
        }
        return <Badge variant="secondary">Kasir</Badge>;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        Manajemen User
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Kelola akses pengguna sistem POS
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <User className="h-5 w-5 text-blue-600" />
                                Tambah User Baru
                            </DialogTitle>
                        </DialogHeader>

                        <form id="create-user-form" action={handleCreateUser} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Masukkan username"
                                    required
                                    className="border-slate-300 dark:border-slate-600"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Masukkan email"
                                    required
                                    className="border-slate-300 dark:border-slate-600"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Masukkan password"
                                    required
                                    className="border-slate-300 dark:border-slate-600"
                                    disabled={isSubmitting}
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-slate-700 dark:text-slate-300">
                                    Role
                                </Label>
                                <Select name="role" required disabled={isSubmitting}>
                                    <SelectTrigger className="border-slate-300 dark:border-slate-600">
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="KASIR">Kasir</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="flex-1 border-slate-300 dark:border-slate-600"
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Membuat...' : 'Buat User'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search Bar */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                            placeholder="Cari user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-slate-300 dark:border-slate-600"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    Total User
                                </p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                                    {users.length}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                    Admin
                                </p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                                    {users.filter(u => u.role === 'ADMIN').length}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                    Kasir
                                </p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
                                    {users.filter(u => u.role === 'KASIR').length}
                                </p>
                            </div>
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Users Table */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <User className="h-5 w-5 text-blue-600" />
                        Daftar User
                        <Badge variant="secondary">
                            {filteredUsers.length} user
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-slate-600 dark:text-slate-400 mt-4">Memuat data user...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                {searchTerm ? 'User tidak ditemukan' : 'Belum ada user'}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {searchTerm
                                    ? 'Coba ubah kata kunci pencarian'
                                    : 'Mulai tambahkan user pertama Anda'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-50/50">
                                        <TableHead className="font-semibold text-slate-900 dark:text-white">
                                            User
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-900 dark:text-white">
                                            Email
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-900 dark:text-white">
                                            Role
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-900 dark:text-white">
                                            Dibuat
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-900 dark:text-white text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow
                                            key={user.id}
                                            className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">
                                                            {user.username}
                                                        </p>
                                                        <p className="text-sm text-slate-500">ID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                    <span className="text-slate-700 dark:text-slate-300">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getRoleBadge(user.role)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        {formatDate(user.createdAt)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                        disabled
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                        disabled
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Hapus
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Info Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                                Informasi Hak Akses
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-400">
                                <div>
                                    <p className="font-medium">👑 Admin</p>
                                    <ul className="mt-1 space-y-1">
                                        <li>• Akses penuh dashboard</li>
                                        <li>• Kelola produk & kategori</li>
                                        <li>• Kelola user & laporan</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-medium">💼 Kasir</p>
                                    <ul className="mt-1 space-y-1">
                                        <li>• Akses POS & transaksi</li>
                                        <li>• Lihat riwayat transaksi</li>
                                        <li>• Tidak bisa kelola user</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}