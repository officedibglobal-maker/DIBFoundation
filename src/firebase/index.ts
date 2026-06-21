
import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
} from "firebase/app";

import {
  getAuth,
  type Auth,
} from "firebase/auth";

import {
  getFirestore,
  type Firestore,
} from "firebase/firestore";

import {
  getStorage,
  type FirebaseStorage,
} from "firebase/storage";

import {
  firebaseConfig,
  isFirebaseConfigValid,
  missingFirebaseEnvVariables,
} from "./config";

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

let cachedServices: FirebaseServices | null = null;

export function initializeFirebase(): FirebaseServices {
  if (cachedServices) {
    return cachedServices;
  }

  if (!isFirebaseConfigValid) {
    throw new Error(
      `Firebase configuration is incomplete. Missing: ${missingFirebaseEnvVariables.join(
        ", "
      )}`
    );
  }

  const app =
    getApps().length > 0
      ? getApp()
      : initializeApp(firebaseConfig);

  cachedServices = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  };

  return cachedServices;
}
