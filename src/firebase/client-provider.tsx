"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { app, auth, db, storage } from "./index";
import type { FirebaseServices } from "./index";

export type FirebaseStatus =
  | "ready"
  | "error";

export interface FirebaseContextValue extends FirebaseServices {
  status: FirebaseStatus;
  error: Error | null;
}

export const FirebaseContext =
  createContext<FirebaseContextValue | null>(null);

export function FirebaseClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      status: "ready" as FirebaseStatus,
      app,
      db,
      auth,
      storage,
      error: null,
    }),
    []
  );

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
