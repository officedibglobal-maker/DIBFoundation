import { adminDb } from '@/firebase/admin';

export type SitePage = {
  id: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  sections?: unknown[];
  createdAt?: unknown;
  updatedAt?: unknown;
  [key: string]: unknown;
};

function serializeFirestoreData<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestoreData(item)) as T;
  }

  if (typeof value === 'object') {
    const possibleTimestamp = value as { toDate?: () => Date };

    if (typeof possibleTimestamp.toDate === 'function') {
      return possibleTimestamp.toDate().toISOString() as T;
    }

    const output: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(
      value as Record<string, unknown>
    )) {
      output[key] = serializeFirestoreData(nestedValue);
    }

    return output as T;
  }

  return value;
}

export async function getSitePageBySlug(
  slug: string
): Promise<SitePage | null> {
  if (!slug) {
    return null;
  }

  try {
    const snapshot = await adminDb
      .collection('sitePages')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];

    if (!doc) {
      return null;
    }

    const data = serializeFirestoreData(doc.data());

    return {
      id: doc.id,
      ...(data as Record<string, unknown>),
    } as SitePage;
  } catch {
    /**
     * Firebase Studio sometimes fails server-side Firestore metadata refresh
     * during preview. Return null so pages can render fallback content instead
     * of crashing the whole route.
     */
    return null;
  }
}