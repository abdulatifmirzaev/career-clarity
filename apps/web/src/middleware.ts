import { NextResponse, type NextRequest } from 'next/server';

// Subdomain and Route Protection Middleware
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Detect admin subdomain (e.g. admin.career-clarity-one.vercel.app, admin.localhost:3000)
  const isAdminSubdomain =
    hostname.startsWith('admin.') || hostname.includes('.admin.') || hostname.startsWith('admin-');

  // If visiting via admin subdomain, rewrite paths to /admin/*
  if (isAdminSubdomain) {
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    if (url.pathname === '/login') {
      url.pathname = '/admin/login';
      return NextResponse.rewrite(url);
    }
    if (
      !url.pathname.startsWith('/admin') &&
      !url.pathname.startsWith('/api') &&
      !url.pathname.startsWith('/_next')
    ) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Admin Route Protection (exclude /admin/login and /api/admin/auth/login)
  const isAdminRoute = url.pathname.startsWith('/admin') && url.pathname !== '/admin/login';
  const isAdminApiRoute =
    url.pathname.startsWith('/api/admin') && !url.pathname.startsWith('/api/admin/auth/login');

  if (isAdminRoute || isAdminApiRoute) {
    const adminToken =
      request.cookies.get('career_admin_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!adminToken) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { success: false, message: 'Admin authentication required' },
          { status: 401 },
        );
      }
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
