
import { useEffect, useState } from 'react';
import { onSnapshot, Query } from 'firebase/firestore';
import { StoredDocument } from '@/types/firestore';

export function useCollection<T>(query: Query<T>) {
  const [data, setData] = useState<StoredDocument<T>[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const data: StoredDocument<T>[] = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data() as StoredDocument<T>);
        });
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
