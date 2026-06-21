
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
  type SetOptions,
  type UpdateData,
  type WithFieldValue,
} from "firebase/firestore";

import { genericConverter } from "./converters";
import type { BaseDocument } from "@/types/firestore";

function requireFirestore(db: Firestore | null | undefined): Firestore {
  if (!db) {
    throw new Error(
      "Firestore is unavailable. Wait for Firebase initialization to complete."
    );
  }

  return db;
}

export async function getDocument<T extends BaseDocument>(
  db: Firestore,
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const firestore = requireFirestore(db);

  const reference = doc(
    firestore,
    collectionName,
    documentId
  ).withConverter(genericConverter<T>());

  const snapshot = await getDoc(reference);

  return snapshot.exists() ? snapshot.data() : null;
}

export async function getDocuments<T extends BaseDocument>(
    db: Firestore,
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const firestore = requireFirestore(db);
    const collRef = collection(firestore, collectionName).withConverter(genericConverter<T>());
    const q = query(collRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
}

export async function createDocument<T extends BaseDocument>(
    db: Firestore,
    collectionName: string,
    data: WithFieldValue<T>
  ): Promise<string> {
    const firestore = requireFirestore(db);
    const collRef = collection(firestore, collectionName).withConverter(genericConverter<T>());
    const docRef = await addDoc(collRef, data);
    return docRef.id;
}

export async function setDocument<T extends BaseDocument>(
    db: Firestore,
    collectionName: string,
    documentId: string,
    data: WithFieldValue<T>,
    options: SetOptions = { merge: true }
  ): Promise<void> {
    const firestore = requireFirestore(db);
    const docRef = doc(firestore, collectionName, documentId).withConverter(genericConverter<T>());
    await setDoc(docRef, data, options);
}

export async function updateDocument<T extends DocumentData>(
    db: Firestore,
    collectionName: string,
    documentId: string,
    data: UpdateData<T>
  ): Promise<void> {
    const firestore = requireFirestore(db);
    const docRef = doc(firestore, collectionName, documentId);
    await updateDoc(docRef, data);
}

export async function deleteDocument(
    db: Firestore,
    collectionName: string,
    documentId: string
  ): Promise<void> {
    const firestore = requireFirestore(db);
    const docRef = doc(firestore, collectionName, documentId);
    await deleteDoc(docRef);
}

export async function queryDocuments<T extends BaseDocument>(
    db: Firestore,
    collectionName: string,
    ...constraints: QueryConstraint[]
): Promise<T[]> {
    const firestore = requireFirestore(db);

    const collRef = collection(
        firestore,
        collectionName
    ).withConverter(genericConverter<T>());

    const q = query(collRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data());
}
