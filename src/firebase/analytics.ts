
'use client';

import { getAnalytics, isSupported } from 'firebase/analytics';
import { app } from './index';

export async function initializeAnalytics() {
  if (typeof window !== 'undefined' && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
}
