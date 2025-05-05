import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // If trying to access the memory-test page in production, redirect to chat
    if (request.nextUrl.pathname.startsWith('/memory-test')) {
      return NextResponse.redirect(new URL('/chat', request.url));
    }

    // If trying to access memory API endpoints in production, return 403
    if (request.nextUrl.pathname.startsWith('/api/memory')) {
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

  return NextResponse.next();
}

// Match specific paths that should be protected in production
export const config = {
  matcher: ['/memory-test/:path*', '/api/memory/:path*'],
}; 