
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { db, storage } from '@/firebase';
import { COLLECTIONS } from './collections';
import type { HeroSlide } from '@/types/hero-slide';

type HeroSlideWriteData = Omit<HeroSlide, 'id'>;

function removeUndefinedValues(
  data: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined
    )
  );
}

function prepareHeroSlideData(
  slide: Partial<HeroSlide>
): Record<string, unknown> {
  const slideData = {
    ...slide,
  } as Record<string, unknown>;

  /*
   * Never store the document ID or stale server timestamps
   * as normal Firestore fields.
   */
  delete slideData.id;
  delete slideData.createdAt;
  delete slideData.updatedAt;

  return removeUndefinedValues(slideData);
}

function getErrorCode(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    return String(
      (error as { code?: unknown }).code ?? ''
    );
  }

  return '';
}

function isManagedStorageUrl(url: string): boolean {
  return (
    url.startsWith('gs://') ||
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('storage.googleapis.com')
  );
}

async function deleteManagedImage(
  imageUrl?: string
): Promise<void> {
  if (
    !imageUrl ||
    !isManagedStorageUrl(imageUrl)
  ) {
    return;
  }

  try {
    await deleteObject(ref(storage, imageUrl));
  } catch (error) {
    const errorCode = getErrorCode(error);

    if (errorCode !== 'storage/object-not-found') {
      console.error(
        'Failed to delete hero image:',
        error
      );
    }
  }
}

export async function getHeroSlides(): Promise<
  HeroSlide[]
> {
  /*
   * Fetch the full collection and sort locally.
   * This retains legacy documents that do not have an order field.
   */
  const snapshot = await getDocs(
    collection(db, COLLECTIONS.heroSlides)
  );

  return snapshot.docs
    .map(
      (documentSnapshot) =>
        ({
          ...documentSnapshot.data(),
          id: documentSnapshot.id,
        }) as HeroSlide
    )
    .sort(
      (firstSlide, secondSlide) =>
        (firstSlide.order ?? 999) -
        (secondSlide.order ?? 999)
    );
}

export async function addHeroSlide(
  slide: HeroSlideWriteData
): Promise<string> {
  const preparedData = prepareHeroSlideData(slide);

  const documentReference = await addDoc(
    collection(db, COLLECTIONS.heroSlides),
    {
      ...preparedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return documentReference.id;
}

export async function updateHeroSlide(
  id: string,
  slide: Partial<HeroSlide>
): Promise<void> {
  const documentReference = doc(
    db,
    COLLECTIONS.heroSlides,
    id
  );

  const preparedData = prepareHeroSlideData(slide);

  await updateDoc(documentReference, {
    ...preparedData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteHeroSlide(
  id: string,
  slide: HeroSlide
): Promise<void> {
  const documentReference = doc(
    db,
    COLLECTIONS.heroSlides,
    id
  );

  /*
   * Delete the Firestore record first so the admin interface
   * is not blocked if Storage cleanup takes longer.
   */
  await deleteDoc(documentReference);

  await Promise.allSettled([
    deleteManagedImage(slide.imageUrl),
    deleteManagedImage(slide.mobileImageUrl),
  ]);
}

export async function duplicateHeroSlide(
  slide: HeroSlide
): Promise<string> {
  const existingSlides = await getHeroSlides();

  const highestOrder = existingSlides.reduce(
    (highest, currentSlide) =>
      Math.max(
        highest,
        currentSlide.order ?? 0
      ),
    0
  );

  const {
    id: _id,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...sourceData
  } = slide;

  const duplicatedSlide: HeroSlideWriteData = {
    ...sourceData,
    title: `${slide.title} (Copy)`,
    isActive: false,
    order: highestOrder + 1,
  };

  return addHeroSlide(duplicatedSlide);
}

export async function updateSlidesOrder(
  slides: Array<{
    id: string;
    order: number;
  }>
): Promise<void> {
  const batch = writeBatch(db);

  slides.forEach((slide, index) => {
    const documentReference = doc(
      db,
      COLLECTIONS.heroSlides,
      slide.id
    );

    const validOrder =
      Number.isFinite(slide.order) &&
      slide.order > 0
        ? slide.order
        : index + 1;

    batch.update(documentReference, {
      order: validOrder,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

export function uploadImage(
  file: File,
  slideId: string,
  type: 'desktop' | 'mobile'
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(
        new Error(
          'The selected file is not a valid image.'
        )
      );
      return;
    }

    const safeSlideId = slideId.replace(
      /[^a-zA-Z0-9_-]/g,
      '-'
    );

    const safeFileName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      '-'
    );

    const fileReference = ref(
      storage,
      `hero-slides/${safeSlideId}/${type}-${Date.now()}-${safeFileName}`
    );

    const uploadTask = uploadBytesResumable(
      fileReference,
      file,
      {
        contentType: file.type,
      }
    );

    uploadTask.on(
      'state_changed',
      () => {
        // Upload progress can be added here later.
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadUrl =
            await getDownloadURL(
              uploadTask.snapshot.ref
            );

          resolve(downloadUrl);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

