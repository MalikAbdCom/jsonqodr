import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the origin of the request
  const origin = request.headers.get('origin') || '*';
  
  // Check if the request is for the API
  const isApiRequest = request.nextUrl.pathname.startsWith('/api');
  
  if (isApiRequest) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return NextResponse.json({}, {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400', // 24 hours
        },
      });
    }
    
    // For all other API requests, add CORS headers to the response
    const response = NextResponse.next();
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
  
  // For non-API requests, just continue
  return NextResponse.next();
}

// Configure the middleware to only run for API routes
export const config = {
  matcher: '/api/:path*',
};
