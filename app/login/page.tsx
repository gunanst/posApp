// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { loginUser } from '@/lib/actions/authActions';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError('');

        try {
            console.log('Form submission started...');
            const result = await loginUser(formData);
            console.log('Login result:', result);

            if (result.success) {
                console.log('Login successful, redirecting...');
                router.push('/dashboard');
                router.refresh();
            } else {
                console.log('Login failed:', result.error);
                setError(result.error || 'Login gagal');
            }
        } catch (err) {
            console.error('Login form error:', err);
            setError(`Terjadi kesalahan: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                        <ShoppingCart className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Azkia POS
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Silakan login untuk mengakses sistem
                    </p>
                </div>

                {/* Login Form */}
                <form action={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                    {error && (
                        <div className="flex items-center space-x-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-medium">
                            Username
                        </Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Masukkan username"
                            required
                            className="w-full"
                            disabled={loading}
                            defaultValue="admin" // Default value untuk testing
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Masukkan password"
                                required
                                className="w-full pr-10"
                                disabled={loading}
                                defaultValue="admin123" // Default value untuk testing
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Memproses...</span>
                            </div>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </form>

                {/* Demo Credentials */}
                <div className="text-center text-sm text-slate-600 dark:text-slate-400 space-y-1 bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <p className="font-medium">Demo Credentials:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-left">
                            <p className="font-semibold">Admin:</p>
                            <p>Username: admin</p>
                            <p>Password: admin123</p>
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">Kasir:</p>
                            <p>Username: kasir</p>
                            <p>Password: kasir123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}