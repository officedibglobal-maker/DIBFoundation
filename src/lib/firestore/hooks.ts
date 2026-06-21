'use client';

import { useFirebase } from "@/firebase/client-provider";

export function useFirestore() {
  return useFirebase();
}
