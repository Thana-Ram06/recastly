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

// Best-effort: keeps the auth_session cookie in sync with Firebase client auth.
// Called fire-and-forget — never blocks the UI or the auth state update.
function syncSessionCookie(firebaseUser: FirebaseUser): void {
  firebaseUser
    .getIdToken()
    .then((token) =>
      fetch('/api/auth/session', {
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
      })
    )
    .then(() => console.log('[Auth] session cookie synced'))
    .catch((e) => console.warn('[Auth] session cookie sync failed (non-fatal):', e));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(getFirebaseApp());
    console.log('[Auth] subscribing to onAuthStateChanged');

    // Safety net: if onAuthStateChanged doesn't fire within 8 seconds
    // (e.g. Firebase SDK blocked by ad-blocker or network issue), stop
    // showing the loading spinner so the user isn't stuck forever.
    const safetyTimer = setTimeout(() => {
      console.warn('[Auth] onAuthStateChanged did not fire after 8s — forcing loading: false');
      setLoading(false);
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      clearTimeout(safetyTimer);
      console.log(
        '[Auth] state →',
        firebaseUser ? `signed in uid=${firebaseUser.uid}` : 'signed out'
      );

      if (firebaseUser) {
        // Sync cookie in background — never awaited, never blocks state update
        syncSessionCookie(firebaseUser);
      } else {
        // Clear the cookie asynchronously on sign-out
        fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
      }

      // Always update state immediately — do NOT await anything before this
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    const auth = getAuth(getFirebaseApp());
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    console.log('[Auth] opening Google sign-in popup');

    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged above handles state — do NOT set state here manually
      console.log('[Auth] signInWithPopup resolved');
    } catch (err: unknown) {
      console.error('[Auth] signInWithPopup error:', err);
      const code = (err as { code?: string })?.code ?? '';
      const message =
        code === 'auth/popup-blocked'
          ? 'Popup blocked — please allow popups for this site and try again.'
          : code === 'auth/popup-closed-by-user'
          ? 'Sign-in cancelled.'
          : code === 'auth/unauthorized-domain'
          ? 'Domain not authorised in Firebase. Add it under Authentication → Settings → Authorised domains.'
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
    // onAuthStateChanged fires null → clears cookie and state automatically
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
