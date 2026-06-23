
import { getApp, getApps, initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig, isFirebaseConfigValid, missingFirebaseEnvVariables } from "./config";

if (!isFirebaseConfigValid) {
  throw new Error(
    `Firebase configuration is incomplete. Missing: ${missingFirebaseEnvVariables.join(
      ", "
    )}`
  );
}

export interface FirebaseServices {
  app: FirebaseApp;
  db: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
}

const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
