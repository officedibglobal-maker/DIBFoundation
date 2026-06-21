
'use client';

import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeFirebase } from './index';

export async function initializeAnalytics() {
  if (typeof window !== 'undefined' && (await isSupported())) {
    const { app } = initializeFirebase();
    return getAnalytics(app);
  }
  return null;
}
