import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // If trying to access the memory-test page in production, redirect to chat
    if (request.nextUrl.pathname.startsWith('/memory-test')) {
      return NextResponse.redirect(new URL('/chat', request.url));
    }

    // If trying to directly access memory API endpoints in production, return 403
    // But allow internal API calls from the application
    if (request.nextUrl.pathname.startsWith('/api/memory')) {
      // Check if the request is coming from our app (has a referer from our domain)
      const referer = request.headers.get('referer');
      const host = request.headers.get('host');
      
      // If no referer or referer doesn't match our domain, block the request
      // This allows internal API calls from our app, but blocks direct access
      if (!referer || !host || !referer.includes(host)) {
        return new NextResponse(
          JSON.stringify({ error: 'This endpoint is not available in production' }),
          { 
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

// Match specific paths that should be protected in production
export const config = {
  matcher: ['/memory-test/:path*', '/api/memory/:path*'],
}; 