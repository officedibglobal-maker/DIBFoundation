
import { useEffect, useState } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';
import { BaseDocument, StoredDocument } from '@/types/firestore';

export function useCollection<T extends BaseDocument>(
  query: Query<T> | null | undefined
) {
  const [data, setData] = useState<StoredDocument<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const data: StoredDocument<T>[] = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as T),
          id: doc.id,
        }));
        setData(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [query]);

  return { data, loading, error };
}
