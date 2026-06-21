'use client';

import { useFirebase } from '@/firebase/client-provider';

export function useFirestore() {
  const {
    db,
    status,
    error,
  } = useFirebase();

  return {
    db,
    status,
    error,
  };
}
