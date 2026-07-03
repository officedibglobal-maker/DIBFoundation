
import "server-only";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, query, type QueryConstraint } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";
import { genericConverter } from "./converters";
import type { BaseDocument, StoredDocument } from "@/types/firestore";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fetches documents from a Firestore collection on the server.
 * 
 * Important: This function is marked with `"server-only"` and should only be used in server-side code (e.g., Server Components, API routes).
 * 
 * @template T The expected type of the documents.
 * @param {string} collectionName The name of the Firestore collection.
 * @param {QueryConstraint[]} [constraints=[]] An array of query constraints (e.g., `where`, `orderBy`).
 * @returns {Promise<StoredDocument<T>[]>} A promise that resolves to an array of documents.
 */
export async function getDocuments<T extends BaseDocument>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<StoredDocument<T>[]> {
    const collRef = collection(db, collectionName).withConverter(genericConverter<T>());
    const q = query(collRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
        };
    });
}
