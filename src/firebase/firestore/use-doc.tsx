
'use client';

import { useState, useEffect } from 'react';
import {
  DocumentReference,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { useFirebase } from '../client-provider';
import { errorEmitter } from '../error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '../errors';

export function useDoc<T = DocumentData>(ref: DocumentReference<T> | null) {
  const { db, status } = useFirebase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (status === 'error' || !db) {
      setError(new Error('Firebase Firestore is unavailable.'));
      setLoading(false);
      return;
    }

    if (!ref) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        setData(
          snapshot.exists()
            ? ({ ...snapshot.data(), id: snapshot.id } as T)
            : null
        );
        setLoading(false);
        setError(null);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get',
        } satisfies SecurityRuleContext);

        errorEmitter.emit('permission-error', permissionError);

        setError(serverError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, ref, status]);

  return { data, loading, error };
}
