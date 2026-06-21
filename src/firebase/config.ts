
import type { FirebaseOptions } from "firebase/app";

const requiredFirebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const missingFirebaseEnvVariables = Object.entries(
  requiredFirebaseEnv
)
  .filter(([, value]) => !value || value.trim().length === 0)
  .map(([key]) => key);

export const isFirebaseConfigValid =
  missingFirebaseEnvVariables.length === 0;

export const firebaseConfig: FirebaseOptions = {
  apiKey: requiredFirebaseEnv.apiKey,
  authDomain: requiredFirebaseEnv.authDomain,
  projectId: requiredFirebaseEnv.projectId,
  storageBucket: requiredFirebaseEnv.storageBucket,
  messagingSenderId: requiredFirebaseEnv.messagingSenderId,
  appId: requiredFirebaseEnv.appId,
  measurementId: requiredFirebaseEnv.measurementId,
};
