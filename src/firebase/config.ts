export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

const requiredFirebaseEnvVariables = [
  {
    key: "NEXT_PUBLIC_FIREBASE_API_KEY",
    value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    value: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    value: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  },
  {
    key: "NEXT_PUBLIC_FIREBASE_APP_ID",
    value: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
];

export const missingFirebaseEnvVariables = requiredFirebaseEnvVariables
  .filter((item) => !item.value)
  .map((item) => item.key);

export const isFirebaseConfigValid =
  missingFirebaseEnvVariables.length === 0;