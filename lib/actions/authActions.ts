// lib/actions/authActions.ts
'use server';

import { cookies } from 'next/headers';

export async function createUser(formData: FormData) {
    try {
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;

        console.log('Creating user:', { username, email, role });

        // Validasi input
        if (!username || !email || !password || !role) {
            return { success: false, error: 'Semua field harus diisi' };
        }

        if (password.length < 6) {
            return { success: false, error: 'Password minimal 6 karakter' };
        }

        // Untuk sementara, return mock response
        // Nanti bisa diganti dengan Prisma ketika database ready
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            role: role as 'ADMIN' | 'KASIR',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log('User created successfully (mock):', newUser.username);

        return {
            success: true,
            user: newUser,
            message: 'User berhasil dibuat'
        };

    } catch (error) {
        console.error('Create user error:', error);
        return {
            success: false,
            error: 'Terjadi kesalahan saat membuat user'
        };
    }
}

export async function updateUser(id: string, formData: FormData) {
    try {
        const username = formData.get('username') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as string;

        console.log('Updating user:', { id, username, email, role });

        // Mock update response
        const updatedUser = {
            id,
            username,
            email,
            role: role as 'ADMIN' | 'KASIR',
            updatedAt: new Date()
        };

        console.log('User updated successfully (mock):', updatedUser.username);

        return {
            success: true,
            user: updatedUser,
            message: 'User berhasil diupdate'
        };

    } catch (error) {
        console.error('Update user error:', error);
        return {
            success: false,
            error: 'Terjadi kesalahan saat mengupdate user'
        };
    }
}

export async function deleteUser(id: string) {
    try {
        console.log('Deleting user:', id);

        // Mock delete response
        console.log('User deleted successfully (mock):', id);

        return {
            success: true,
            message: 'User berhasil dihapus'
        };

    } catch (error) {
        console.error('Delete user error:', error);
        return {
            success: false,
            error: 'Terjadi kesalahan saat menghapus user'
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