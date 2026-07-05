import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

export type FirebaseStatus = 'loading' | 'ready' | 'error';

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

export const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);

export const db: Firestore = getFirestore(app);

export const storage: FirebaseStorage = getStorage(app);

export function initializeFirebase(): FirebaseServices {
  return {
    app,
    auth,
    db,
    storage,
  };
}