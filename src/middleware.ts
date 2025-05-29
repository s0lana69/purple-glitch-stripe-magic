import { NextResponse, type NextRequest } from 'next/server';

// ABSOLUTE MINIMUM MIDDLEWARE - NO CONSOLE LOGGING
// Only processes dashboard routes, completely skips all other routes
export async function middleware(req: NextRequest) {
  // Just pass through without any processing or logging
  return NextResponse.next();
}

// Restrict middleware to ONLY run on dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
