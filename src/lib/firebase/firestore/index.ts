import { adminDb } from '@/firebase/admin';
import type { SitePage } from '@/lib/models/site-pages';

const SITE_PAGES_COLLECTION = 'sitePages';

type SitePageInput = Partial<Omit<SitePage, 'id'>> & {
  id?: string;
  slug?: string;
  title?: string;
};

function removeUndefinedValues<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined)
  ) as T;
}

function normalizeSitePage(
  id: string,
  data: Partial<SitePage> | FirebaseFirestore.DocumentData | undefined,
  fallbackSlug?: string
): SitePage {
  const safeData = (data ?? {}) as Partial<SitePage>;

  return {
    id,
    slug:
      typeof safeData.slug === 'string' && safeData.slug.length > 0
        ? safeData.slug
        : fallbackSlug ?? id,
    title:
      typeof safeData.title === 'string' && safeData.title.length > 0
        ? safeData.title
        : 'Untitled Page',
    status: safeData.status === 'draft' ? 'draft' : 'published',
    sections: Array.isArray(safeData.sections) ? safeData.sections : [],
    subtitle: safeData.subtitle ?? '',
    eyebrow: safeData.eyebrow ?? '',
    heroImageUrl: safeData.heroImageUrl ?? '',
    ctas: Array.isArray(safeData.ctas) ? safeData.ctas : [],
    seoTitle: safeData.seoTitle ?? '',
    seoDescription: safeData.seoDescription ?? '',
    order: typeof safeData.order === 'number' ? safeData.order : 0,
    createdAt: safeData.createdAt,
    updatedAt: safeData.updatedAt,
  };
}

function makeDocumentIdFromSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function getSitePages(): Promise<SitePage[]> {
  const snapshot = await adminDb
    .collection(SITE_PAGES_COLLECTION)
    .orderBy('order', 'asc')
    .get();

  return snapshot.docs.map((doc) => normalizeSitePage(doc.id, doc.data()));
}

export async function listSitePages(): Promise<SitePage[]> {
  return getSitePages();
}

export async function getAllSitePages(): Promise<SitePage[]> {
  return getSitePages();
}

export async function getSitePageById(
  id: string
): Promise<SitePage | null> {
  if (!id) {
    return null;
  }

  const doc = await adminDb.collection(SITE_PAGES_COLLECTION).doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return normalizeSitePage(doc.id, doc.data());
}

export async function getSitePage(
  id: string
): Promise<SitePage | null> {
  return getSitePageById(id);
}

export async function getSitePageBySlug(
  slug: string
): Promise<SitePage | null> {
  if (!slug) {
    return null;
  }

  const snapshot = await adminDb
    .collection(SITE_PAGES_COLLECTION)
    .where('slug', '==', slug)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];

  return normalizeSitePage(doc.id, doc.data(), slug);
}

export async function createSitePage(
  data: SitePageInput
): Promise<SitePage> {
  const slug =
    typeof data.slug === 'string' && data.slug.length > 0
      ? data.slug
      : makeDocumentIdFromSlug(data.title ?? 'untitled-page');

  const documentId = data.id || makeDocumentIdFromSlug(slug);

  const payload = removeUndefinedValues({
    slug,
    title: data.title || 'Untitled Page',
    subtitle: data.subtitle ?? '',
    eyebrow: data.eyebrow ?? '',
    heroImageUrl: data.heroImageUrl ?? '',
    status: data.status === 'draft' ? 'draft' : 'published',
    sections: Array.isArray(data.sections) ? data.sections : [],
    ctas: Array.isArray(data.ctas) ? data.ctas : [],
    seoTitle: data.seoTitle ?? '',
    seoDescription: data.seoDescription ?? '',
    order: typeof data.order === 'number' ? data.order : 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await adminDb
    .collection(SITE_PAGES_COLLECTION)
    .doc(documentId)
    .set(payload, { merge: true });

  return normalizeSitePage(documentId, payload);
}

export async function updateSitePage(
  id: string,
  data: SitePageInput
): Promise<SitePage> {
  if (!id) {
    throw new Error('A site page id is required.');
  }

  const payload = removeUndefinedValues({
    slug: data.slug,
    title: data.title,
    subtitle: data.subtitle,
    eyebrow: data.eyebrow,
    heroImageUrl: data.heroImageUrl,
    status: data.status,
    sections: data.sections,
    ctas: data.ctas,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    order: data.order,
    updatedAt: new Date(),
  });

  await adminDb
    .collection(SITE_PAGES_COLLECTION)
    .doc(id)
    .set(payload, { merge: true });

  const updatedPage = await getSitePageById(id);

  if (!updatedPage) {
    throw new Error(`Site page "${id}" could not be found after update.`);
  }

  return updatedPage;
}

export async function upsertSitePage(
  data: SitePageInput
): Promise<SitePage> {
  if (data.id) {
    return updateSitePage(data.id, data);
  }

  return createSitePage(data);
}

export async function deleteSitePage(id: string): Promise<void> {
  if (!id) {
    throw new Error('A site page id is required.');
  }

  await adminDb.collection(SITE_PAGES_COLLECTION).doc(id).delete();
}

export { normalizeSitePage };