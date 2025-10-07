'use server';

import prisma from '@/lib/prisma';
import { generateToken, verifyPassword, hashPassword, verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginUser(formData: FormData) {
    console.log('🔐 [SERVER] Login process started');

    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    console.log('📥 [SERVER] Received:', { username, password: '***' });

    try {
        // Cari user by username atau email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: username }
                ]
            }
        });

        console.log('👤 [SERVER] User found:', user ? 'Yes' : 'No');

        if (!user) {
            console.log('❌ [SERVER] User not found');
            return { success: false, error: 'Username atau password salah' };
        }

        // Verifikasi password
        const isPasswordValid = verifyPassword(password, user.password);
        console.log('🔑 [SERVER] Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return { success: false, error: 'Username atau password salah' };
        }

        // Generate JWT token (await karena sekarang async)
        const token = await generateToken({
            userId: user.id,
            username: user.username,
            role: user.role as 'ADMIN' | 'KASIR'
        });

        console.log('🎫 [SERVER] Token generated');

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        console.log('✅ [SERVER] Login successful for user:', user.username);

        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role as 'ADMIN' | 'KASIR'
            }
        };
    } catch (error) {
        console.error('💥 [SERVER] Login error:', error);
        return { success: false, error: 'Terjadi kesalahan saat login' };
    }
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/login');
}

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token);

        if (!payload) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return user;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

export async function createUser(formData: FormData) {
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as 'ADMIN' | 'KASIR';

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return { success: false, error: 'Username atau email sudah digunakan' };
        }

        // Hash password
        const hashedPassword = hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return { success: true, user };
    } catch (error) {
        console.error('Create user error:', error);
        return { success: false, error: 'Gagal membuat user' };
    }
}