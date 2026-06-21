
'use client';

import { useState, useEffect } from 'react';
import { type User, onAuthStateChanged } from 'firebase/auth';
import { useFirebase } from '../client-provider';

interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const devAdminBypass = process.env.NEXT_PUBLIC_DEV_ADMIN_BYPASS === 'true';

export function useUser(): UseUserResult {
  const { auth, status } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'error') {
      setLoading(false);
      setError(new Error('Firebase initialization failed.'));
      return;
    }

    if (devAdminBypass) {
      setUser({ uid: 'dev-admin' } as User);
      setLoading(false);
      return;
    }

    if (!auth) {
      setLoading(false);
      setError(new Error("Firebase Authentication is unavailable."));
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
        setError(null);
      },
      (authError) => {
        setError(authError);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [auth, status]);

  return { user, loading, error };
}
