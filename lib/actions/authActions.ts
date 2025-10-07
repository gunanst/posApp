// lib/actions/authActions.ts
'use server';

import { cookies } from 'next/headers';


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
        cookieStore.delete('token');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false };
    }
}