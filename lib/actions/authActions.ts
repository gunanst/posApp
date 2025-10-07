// lib/actions/authActions.ts
'use server';

import { cookies } from 'next/headers';

export async function loginUser(formData: FormData) {
    try {
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        console.log('Login attempt:', username);

        if (!username || !password) {
            return { success: false, error: 'Username dan password harus diisi' };
        }

        // MOCK DATA - tanpa database
        const mockUsers = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'ADMIN' as const,
                email: 'admin@azkiapos.com',
                id: '1'
            },
            {
                username: 'kasir',
                password: 'kasir123',
                role: 'KASIR' as const,
                email: 'kasir@azkiapos.com',
                id: '2'
            }
        ];

        const user = mockUsers.find(u => u.username === username && u.password === password);

        if (!user) {
            return { success: false, error: 'Username atau password salah' };
        }

        // Set user cookie
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        const cookieStore = await cookies();
        cookieStore.set('user', JSON.stringify(userData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 1 day
        });

        console.log('Login successful for:', username);
        return { success: true, user: userData };

    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Terjadi kesalahan sistem saat login'
        };
    }
}

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const userCookie = cookieStore.get('user');

        if (!userCookie) {
            return null;
        }

        return JSON.parse(userCookie.value);
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

export async function logoutUser() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('user');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}