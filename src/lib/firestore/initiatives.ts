
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Initiative } from '@/types/initiative';
import { deleteInitiativeImage, uploadInitiativeImage } from '@/lib/firebase/storage';

const INITIATIVES_COLLECTION = 'initiatives';

export async function getInitiatives(): Promise<Initiative[]> {
  const snapshot = await getDocs(collection(db, INITIATIVES_COLLECTION));
  return snapshot.docs.map(
    (doc) =>
      ({
        docId: doc.id,
        ...doc.data(),
      } as Initiative)
  );
}

export async function addInitiative(
  initiativeData: Omit<Initiative, 'docId' | 'id' | 'createdAt' | 'updatedAt'>,
  imageFile?: File
): Promise<string> {
  const docRef = doc(collection(db, INITIATIVES_COLLECTION));
  let imageUrl = initiativeData.imageUrl || '';

  if (imageFile) {
    imageUrl = await uploadInitiativeImage(imageFile, docRef.id);
  }

  await addDoc(collection(db, INITIATIVES_COLLECTION), {
    ...initiativeData,
    id: docRef.id,
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateInitiative(
  docId: string,
  initiativeData: Partial<Omit<Initiative, 'docId' | 'id'>>,
  imageFile?: File
): Promise<void> {
  const docRef = doc(db, INITIATIVES_COLLECTION, docId);
  let imageUrl = initiativeData.imageUrl;

  if (imageFile) {
    const existingDoc = await getDoc(docRef);
    const existingImageUrl = existingDoc.data()?.imageUrl;
    if (existingImageUrl) {
      await deleteInitiativeImage(existingImageUrl);
    }
    imageUrl = await uploadInitiativeImage(imageFile, docId);
  }

  await updateDoc(docRef, {
    ...initiativeData,
    ...(imageUrl && { imageUrl }),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteInitiative(docId: string, imageUrl: string): Promise<void> {
  await deleteDoc(doc(db, INITIATIVES_COLLECTION, docId));
  await deleteInitiativeImage(imageUrl);
}
