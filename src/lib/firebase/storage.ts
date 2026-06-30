
import { storage } from '@/firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { FirebaseError } from 'firebase/app';

const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, '-');

const validateImage = (file: File) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Invalid file type. Please select a JPG, PNG, or WebP image.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large. Please select an image smaller than 5MB.');
  }
};

export async function uploadInitiativeImage(
  file: File,
  documentId: string
): Promise<string> {
  validateImage(file);
  const sanitized = sanitizeFileName(file.name);
  const storageRef = ref(
    storage,
    `initiatives/${documentId}/${Date.now()}-${sanitized}`
  );

  await uploadBytesResumable(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteInitiativeImage(imageUrl: string): Promise<void> {
  if (!imageUrl || !imageUrl.includes('firebasestorage.googleapis.com')) {
    return;
  }

  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'storage/object-not-found') {
      console.warn(`Image not found in storage: ${imageUrl}`);
    } else {
      console.error(`Failed to delete image from storage: ${imageUrl}`, error);
    }
  }
}
