
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  type DocumentData,
  type CollectionReference,
  type DocumentReference,
  type Firestore,
  type QuerySnapshot,
  type DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase";

/**
 * Removes undefined values from an object. This is useful before writing to
 * Firestore, which does not allow undefined values.
 * @param obj The object to clean.
 * @returns A new object with undefined values removed.
 */
const removeUndefined = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = removeUndefined(value);
    }
    return acc;
  }, {} as any);
};

/**
 * Fetches all documents from a specified collection.
 * @param collectionName The name of the collection.
 * @returns A promise that resolves to an array of documents, each with its ID.
 * @throws Throws an error if the collection name is invalid or if the fetch fails.
 */
export async function getCollectionDocuments<T = DocumentData>(
  collectionName: string
): Promise<(T & { id: string })[]> {
  if (!collectionName) {
    throw new Error("A valid collection name must be provided.");
  }
  try {
    const collectionRef: CollectionReference<T> = collection(
      db as Firestore,
      collectionName
    ) as CollectionReference<T>;
    const querySnapshot: QuerySnapshot<T> = await getDocs(collectionRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error(`Error fetching collection '${collectionName}':`, error);
    throw new Error(`Failed to fetch documents from '${collectionName}'.`);
  }
}

/**
 * Fetches a single document by its ID from a specified collection.
 * @param collectionName The name of the collection.
 * @param id The ID of the document.
 * @returns A promise that resolves to the document with its ID, or null if not found.
 * @throws Throws an error if the collection name or ID is invalid, or if the fetch fails.
 */
export async function getDocumentById<T = DocumentData>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  if (!collectionName || !id) {
    throw new Error("A valid collection name and document ID must be provided.");
  }
  try {
    const docRef: DocumentReference<T> = doc(
      db as Firestore,
      collectionName,
      id
    ) as DocumentReference<T>;
    const docSnap: DocumentSnapshot<T> = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error: any) {
    console.error(`Error fetching document '${id}' from '${collectionName}':`, error);
    throw new Error(`Failed to fetch document '${id}' from '${collectionName}'.`);
  }
}

/**
 * Creates a new document in a specified collection.
 * @param collectionName The name of the collection.
 * @param data The data for the new document.
 * @returns A promise that resolves to the ID of the newly created document.
 * @throws Throws an error if the collection name is invalid or if the creation fails.
 */
export async function createCollectionDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  if (!collectionName) {
    throw new Error("A valid collection name must be provided.");
  }
  try {
    const cleanedData = removeUndefined(data);
    const docRef = await addDoc(collection(db as Firestore, collectionName), {
      ...cleanedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error(`Error creating document in '${collectionName}':`, error);
    throw new Error(`Failed to create document in '${collectionName}'.`);
  }
}

// Backward-compatible alias
export const createDocument = createCollectionDocument;


/**
 * Updates an existing document in a specified collection.
 * 'createdAt' timestamp is preserved and 'updatedAt' is set to the current server time.
 * @param collectionName The name of the collection.
 * @param id The ID of the document to update.
 * @param data The data to update the document with.
 * @throws Throws an error if the update fails.
 */
export async function updateCollectionDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> {
  if (!collectionName || !id) {
    throw new Error("A valid collection name and document ID must be provided.");
  }
  try {
    const docRef = doc(db as Firestore, collectionName, id);
    // Preserve createdAt and prevent it from being overwritten
    const { createdAt, ...updateData } = data as any;
    const cleanedData = removeUndefined(updateData);

    await updateDoc(docRef, {
      ...cleanedData,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error(`Error updating document '${id}' in '${collectionName}':`, error);
    throw new Error(`Failed to update document '${id}' in '${collectionName}'.`);
  }
}

// Backward-compatible alias
export const updateDocument = updateCollectionDocument;

/**
 * Deletes a document from a specified collection.
 * @param collectionName The name of the collection.
 * @param id The ID of the document to delete.
 * @throws Throws an error if the deletion fails.
 */
export async function deleteCollectionDocument(
  collectionName: string,
  id: string
): Promise<void> {
  if (!collectionName || !id) {
    throw new Error("A valid collection name and document ID must be provided.");
  }
  try {
    const docRef = doc(db as Firestore, collectionName, id);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error(`Error deleting document '${id}' in '${collectionName}':`, error);
    throw new Error(`Failed to delete document '${id}' in '${collectionName}'.`);
  }
}

// Backward-compatible alias
export const deleteDocument = deleteCollectionDocument;
