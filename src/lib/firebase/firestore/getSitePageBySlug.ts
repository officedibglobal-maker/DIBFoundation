import { adminDb } from '@/firebase/admin';
import type { SitePage } from '@/lib/models/site-pages';

export async function getSitePageBySlug(
  slug: string
): Promise<SitePage | null> {
  const snapshot = await adminDb
    .collection('sitePages')
    .where('slug', '==', slug)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data() as Partial<SitePage>;

  return {
    id: doc.id,
    slug: typeof data.slug === 'string' && data.slug.length > 0 ? data.slug : slug,
    title:
      typeof data.title === 'string' && data.title.length > 0
        ? data.title
        : 'Untitled Page',
    status: data.status === 'draft' ? 'draft' : 'published',
    sections: Array.isArray(data.sections) ? data.sections : [],
    subtitle: data.subtitle ?? '',
    eyebrow: data.eyebrow ?? '',
    heroImageUrl: data.heroImageUrl ?? '',
    ctas: Array.isArray(data.ctas) ? data.ctas : [],
    seoTitle: data.seoTitle ?? '',
    seoDescription: data.seoDescription ?? '',
    order: typeof data.order === 'number' ? data.order : 0,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}