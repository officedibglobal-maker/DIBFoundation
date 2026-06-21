
'use client';

import { useFirebase } from '../client-provider';

export function useFirestore() {
  const { db } = useFirebase();
  return db;
}
