
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { useFirebase } from '../client-provider';
import { errorEmitter } from '../error-emitter';
import {
  FirestorePermissionError,
  type SecurityRuleContext,
} from '../errors';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const { db, status } = useFirebase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (status !== "ready" || !db) {
      if (status === 'ready' && !db) {
          setLoading(false);
      }
      return;
    }

    if (!query) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);

    const firestore = db;
    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(items);
        setLoading(false);
        setError(null);
      },
      async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: (query as any)._query?.path?.toString() || 'unknown',
          operation: 'list',
        } satisfies SecurityRuleContext);

        errorEmitter.emit('permission-error', permissionError);

        setError(serverError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, query, status]);

  return { data, loading, error };
}
