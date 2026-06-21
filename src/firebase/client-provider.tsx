
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initializeFirebase, FirebaseServices } from './index';

export type FirebaseStatus = 'loading' | 'ready' | 'error';

export interface FirebaseClientContextValue extends Partial<FirebaseServices> {
  status: FirebaseStatus;
  error: Error | null;
}

const FirebaseClientContext = createContext<FirebaseClientContextValue | undefined>(
  undefined
);

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [contextValue, setContextValue] = useState<FirebaseClientContextValue>({
    status: 'loading',
    error: null,
  });

  useEffect(() => {
    try {
      const services = initializeFirebase();
      setContextValue({
        ...services,
        status: 'ready',
        error: null,
      });
    } catch (error) {
      console.error('Firebase initialization failed in provider:', error);
      setContextValue({
        status: 'error',
        error: error instanceof Error ? error : new Error('Firebase initialization failed'),
      });
    }
  }, []);

  const memoizedValue = useMemo(() => contextValue, [contextValue]);

  return (
    <FirebaseClientContext.Provider value={memoizedValue}>
      {children}
    </FirebaseClientContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseClientContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseClientProvider');
  }
  return context;
}
