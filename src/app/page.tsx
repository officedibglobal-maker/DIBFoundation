import { Hero } from '@/components/home/Hero';
import { ImpactStats } from '@/components/home/ImpactStats';
import { MissionVision } from '@/components/home/MissionVision';
import { WhyDIBF } from '@/components/home/WhyDIBF';
import { CoreFocusAreas } from '@/components/home/CoreFocusAreas';
import { InitiativesSlider } from '@/components/home/InitiativesSlider';
import { ImpactInAction } from '@/components/home/ImpactInAction';
import { PartnershipsForImpact } from '@/components/home/PartnershipsForImpact';
import { ImpactStorePreview } from '@/components/home/ImpactStorePreview';
import { BePartOfTheJourney } from '@/components/home/BePartOfTheJourney';

import { getHomepageSettings } from '@/lib/firestore/homepage-settings';
import { getDocuments } from '@/lib/firestore/server';
import { COLLECTIONS } from '@/lib/firestore/collections';

type PlainDocument = Record<string, unknown>;

function getCollectionName(key: string, fallback: string) {
  return (COLLECTIONS as Record<string, string>)[key] || fallback;
}

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

async function safeGetDocuments(
  collectionName: string
): Promise<PlainDocument[]> {
  try {
    const documents = await getDocuments<any>(collectionName, []);
    return serializeFirestoreData(documents || []) as PlainDocument[];
  } catch {
    return [];
  }
}

async function safeGetHomepageSettings() {
  try {
    return await getHomepageSettings();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [
    heroSlides,
    impactStats,
    focusAreas,
    initiatives,
    impactStories,
    partners,
    impactStoreProducts,
    homepageSettings,
  ] = await Promise.all([
    safeGetDocuments(getCollectionName('heroSlides', 'heroSlides')),
    safeGetDocuments(getCollectionName('impactStats', 'impactStats')),
    safeGetDocuments(getCollectionName('focusAreas', 'focusAreas')),
    safeGetDocuments(getCollectionName('initiatives', 'initiatives')),
    safeGetDocuments(getCollectionName('impactStories', 'impactStories')),
    safeGetDocuments(getCollectionName('partners', 'partners')),
    safeGetDocuments(
      getCollectionName('impactStoreProducts', 'impactStoreProducts')
    ),
    safeGetHomepageSettings(),
  ]);

  return (
    <main className="overflow-hidden bg-white">
      <Hero slides={heroSlides as any} />

      <ImpactStats stats={impactStats as any} />

      <MissionVision />

      <WhyDIBF settings={homepageSettings?.whyDibf} />

      <CoreFocusAreas
        focusAreas={focusAreas as any}
        settings={homepageSettings?.coreFocus}
      />

      <InitiativesSlider initiatives={initiatives as any} />

      <ImpactInAction stories={impactStories as any} />

      <PartnershipsForImpact
        partners={partners as any}
        settings={homepageSettings?.partnership}
      />

      <ImpactStorePreview
        products={impactStoreProducts as any}
        settings={homepageSettings?.impactStore}
      />

      <BePartOfTheJourney settings={homepageSettings?.finalCta} />
    </main>
  );
}