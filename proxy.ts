import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NOTE: We intentionally do NOT block /dashboard routes here.
//
// Why: The proxy runs on every navigation including client-side router.replace().
// The auth_session cookie is set asynchronously (fire-and-forget in AuthProvider),
// so blocking /dashboard when cookie is missing creates an infinite redirect loop:
//   onAuthStateChanged → router.replace('/dashboard') → proxy: no cookie → /login
//   → onAuthStateChanged → router.replace('/dashboard') → proxy: no cookie → ...
//
// Dashboard protection is handled client-side by app/(dashboard)/layout.tsx which
// redirects unauthenticated users to /login. API routes verify tokens server-side.
// Both are more reliable than a cookie-existence check here.

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Empty matcher — proxy passes all requests through.
  // Remove this file entirely if Next.js requires at least one matcher.
  matcher: [],
};
