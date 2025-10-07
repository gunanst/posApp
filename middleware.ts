import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/api/dashboard'];
const publicRoutes = ['/login', '/api/auth/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('token')?.value;

    console.log('🛡️ Middleware running for:', pathname);

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    const isPublicRoute = publicRoutes.some(route =>
        pathname.startsWith(route)
    );

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        console.log('🔐 No token, redirecting to login');
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Verify token for protected routes
    if (isProtectedRoute && token) {
        try {
            const { verifyToken } = await import('@/lib/auth');
            const payload = await verifyToken(token);

            if (!payload) {
                console.log('❌ Invalid token, redirecting to login');
                const loginUrl = new URL('/login', request.url);
                const response = NextResponse.redirect(loginUrl);
                response.cookies.delete('token');
                return response;
            }

            console.log('✅ Token valid for user:', payload.username);

            // Check role-based access for specific routes
            if ((pathname.startsWith('/dashboard/products') ||
                pathname.startsWith('/dashboard/categories') ||
                pathname.startsWith('/dashboard/users')) &&
                payload.role !== 'ADMIN') {
                console.log('🚫 Insufficient permissions, redirecting to dashboard');
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

        } catch (error) {
            console.error('💥 Token verification error:', error);
            const loginUrl = new URL('/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('token');
            return response;
        }
    }

    // Redirect to dashboard if accessing login with valid token
    if (isPublicRoute && token && pathname === '/login') {
        try {
            const { verifyToken } = await import('@/lib/auth');
            const payload = await verifyToken(token);
            if (payload) {
                console.log('🔁 Already logged in, redirecting to dashboard');
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        } catch (error) {
            console.error('💥 Token check error:', error);
            // Continue to login page if token is invalid
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/api/dashboard/:path*',
        '/api/auth/:path*'
    ]
};