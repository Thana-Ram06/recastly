'use client';

// Single source of truth — all auth state lives in AuthProvider.
// Components import from here; never create a second onAuthStateChanged listener.
export { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
