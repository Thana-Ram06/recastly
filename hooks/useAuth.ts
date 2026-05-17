'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { getFirebaseApp } from '@/firebase/config';

function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false, error: null });
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        }),
      });

      setState({ user: result.user, loading: false, error: null });
      return result.user;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign in failed';
      setState((s) => ({ ...s, loading: false, error }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
    await fetch('/api/auth/session', { method: 'DELETE' });
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!state.user) return null;
    return state.user.getIdToken();
  }, [state.user]);

  return { ...state, signInWithGoogle, logout, getToken };
}
