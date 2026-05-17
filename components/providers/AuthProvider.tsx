'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { getFirebaseApp } from '@/firebase/config';

interface AuthContextValue {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  logout: async () => {},
  getToken: async () => null,
});

async function refreshSessionCookie(firebaseUser: FirebaseUser): Promise<void> {
  try {
    const token = await firebaseUser.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }),
    });
    console.log('[Auth] session cookie refreshed');
  } catch (e) {
    // Non-fatal — client-side auth still works without the cookie.
    // Proxy protection is secondary; API routes verify tokens directly.
    console.warn('[Auth] session cookie refresh failed (non-fatal):', e);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // DO NOT call setPersistence here — Firebase defaults to browserLocalPersistence
    // on the web, and calling it on an already-authenticated instance temporarily
    // nulls the auth state, causing the infinite-spinner bug in the dashboard layout.
    const auth = getAuth(getFirebaseApp());
    console.log('[Auth] subscribing to onAuthStateChanged');

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] state changed →', firebaseUser ? `uid=${firebaseUser.uid}` : 'signed out');

      if (firebaseUser) {
        // Refresh session cookie so the server-side proxy stays in sync.
        // This is fire-and-forget — we don't block showing the UI.
        refreshSessionCookie(firebaseUser);
      } else {
        // Clear cookie on sign-out
        fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const auth = getAuth(getFirebaseApp());
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    console.log('[Auth] opening Google sign-in popup');

    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged above handles everything after this point.
      // Do NOT manually set user state here — that creates duplicate state.
      console.log('[Auth] popup completed — waiting for onAuthStateChanged');
    } catch (err: unknown) {
      console.error('[Auth] signInWithPopup error:', err);
      const code = (err as { code?: string })?.code ?? '';
      const message =
        code === 'auth/popup-blocked'
          ? 'Popup was blocked. Please allow popups for this site and try again.'
          : code === 'auth/popup-closed-by-user'
          ? 'Sign-in cancelled.'
          : code === 'auth/unauthorized-domain'
          ? 'This domain is not authorised. Add it to Firebase Console → Authentication → Settings → Authorised domains.'
          : err instanceof Error
          ? err.message
          : 'Sign-in failed. Please try again.';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('[Auth] signing out');
    const auth = getAuth(getFirebaseApp());
    await signOut(auth);
    // Cookie deletion is handled by onAuthStateChanged → null path above
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!user) return null;
    return user.getIdToken();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
