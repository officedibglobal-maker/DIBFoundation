'use client';

import * as React from 'react';
import {
  initializeFirebase,
  type FirebaseServices,
  type FirebaseStatus,
} from './index';

export interface FirebaseContextValue extends Partial<FirebaseServices> {
  status: FirebaseStatus;
  error?: Error;
}

const FirebaseContext = React.createContext<FirebaseContextValue>({
  status: 'loading',
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = React.useState<FirebaseContextValue>({
    status: 'loading',
  });

  React.useEffect(() => {
    try {
      const services = initializeFirebase();

      setValue({
        ...services,
        status: 'ready',
      });
    } catch (error) {
      console.error('Firebase initialization failed:', error);

      setValue({
        status: 'error',
        error:
          error instanceof Error
            ? error
            : new Error('Firebase initialization failed'),
      });
    }
  }, []);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}

export function useFirebase() {
  return React.useContext(FirebaseContext);
}