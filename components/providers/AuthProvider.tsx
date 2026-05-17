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
  setPersistence,
  browserLocalPersistence,
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // browser-only — set explicit local persistence then subscribe
    const auth = getAuth(getFirebaseApp());

    console.log('[Auth] initialising, setting browserLocalPersistence');

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('[Auth] persistence set — subscribing to onAuthStateChanged');
      })
      .catch((err) => {
        console.warn('[Auth] setPersistence failed (non-fatal):', err);
      });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged →', firebaseUser ? `uid=${firebaseUser.uid}` : 'null');
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

    console.log('[Auth] signInWithPopup — opening Google popup');

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('[Auth] popup resolved — uid:', result.user.uid);

      // Sync user record to Firestore + set session cookie (best-effort)
      try {
        const token = await result.user.getIdToken();
        const res = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          }),
        });
        console.log('[Auth] session API status:', res.status);
      } catch (sessionErr) {
        // Non-fatal — Firebase client auth still works without session cookie
        console.warn('[Auth] session API error (non-fatal):', sessionErr);
      }
    } catch (err: unknown) {
      console.error('[Auth] signInWithPopup error:', err);
      const code = (err as { code?: string })?.code ?? '';
      const message =
        code === 'auth/popup-blocked'
          ? 'Popup was blocked. Please allow popups for this site and try again.'
          : code === 'auth/popup-closed-by-user'
          ? 'Sign-in cancelled.'
          : code === 'auth/unauthorized-domain'
          ? 'This domain is not authorised in Firebase. Add it to Firebase Console → Authentication → Settings → Authorised domains.'
          : (err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('[Auth] logging out');
    const auth = getAuth(getFirebaseApp());
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {});
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
