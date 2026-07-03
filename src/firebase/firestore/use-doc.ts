
import { useEffect, useState } from 'react';
import { doc, onSnapshot, DocumentReference } from 'firebase/firestore';

export function useDoc<T>(ref: DocumentReference<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        setData(doc.data());
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [ref]);

  return { data, loading, error };
}
