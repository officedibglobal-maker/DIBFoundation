"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { initializeFirebase } from "./index";
import type { FirebaseServices } from "./index";

export type FirebaseStatus =
  | "loading"
  | "ready"
  | "error";

export interface FirebaseContextValue {
  status: FirebaseStatus;
  app: FirebaseServices["app"] | null;
  auth: FirebaseServices["auth"] | null;
  db: FirebaseServices["db"] | null;
  storage: FirebaseServices["storage"] | null;
  error: Error | null;
}

const initialValue: FirebaseContextValue = {
  status: "loading",
  app: null,
  auth: null,
  db: null,
  storage: null,
  error: null,
};

export const FirebaseContext =
  createContext<FirebaseContextValue | null>(null);

export function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<FirebaseContextValue>(initialValue);

  useEffect(() => {
    let active = true;

    try {
      const services = initializeFirebase();

      if (active) {
        setState({
          status: "ready",
          ...services,
          error: null,
        });
      }
    } catch (error) {
      if (active) {
        setState({
          status: "error",
          app: null,
          auth: null,
          db: null,
          storage: null,
          error:
            error instanceof Error
              ? error
              : new Error(
                  "Unknown Firebase initialization error"
                ),
        });
      }
    }

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase(): FirebaseContextValue {
  const context = useContext(FirebaseContext);

  if (!context) {
    throw new Error(
      "useFirebase must be used inside FirebaseClientProvider."
    );
  }

  return context;
}
