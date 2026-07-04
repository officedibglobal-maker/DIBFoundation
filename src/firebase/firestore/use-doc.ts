
import { useEffect, useState } from 'react';
import { onSnapshot, DocumentReference } from 'firebase/firestore';
import { BaseDocument, StoredDocument } from '@/types/firestore';

export function useDoc<T extends BaseDocument>(
  ref: DocumentReference<T> | null | undefined
) {
  const [data, setData] = useState<StoredDocument<T> | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    if (!ref) {
      setData(undefined);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        if (doc.exists()) {
          setData({
            ...(doc.data() as T),
            id: doc.id,
          });
        } else {
          setData(undefined);
        }
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
