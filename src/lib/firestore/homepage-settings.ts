import { adminDb } from '@/firebase/admin';

export type HomepageSectionSettings = {
  sectionLabel?: string;
  sectionTitle?: string;
  sectionBody?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaLink?: string;
  backgroundImageUrl?: string;
};

export type HomepageSettings = {
  whyDibf?: HomepageSectionSettings;
  coreFocus?: HomepageSectionSettings;
  partnership?: HomepageSectionSettings;
  impactStore?: HomepageSectionSettings;
  finalCta?: HomepageSectionSettings;
};

const possibleDocPaths = [
  'websiteConfiguration/homepage',
  'websiteConfigurations/homepage',
  'website-configurations/homepage',
  'siteSettings/homepage',
  'settings/homepage',
  'configuration/homepage',
  'homepageSettings/default',
  'homepageSettings/homepage',
];

function getString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function pickString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = getString(source[key]);
    if (value) return value;
  }

  return '';
}

function getObject(source: Record<string, unknown>, key: string) {
  const value = source[key];

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function normalizeHomepageSettings(
  data: Record<string, unknown>
): HomepageSettings {
  const whyDibf = getObject(data, 'whyDibf');
  const coreFocus = getObject(data, 'coreFocus');
  const partnership = getObject(data, 'partnership');
  const impactStore = getObject(data, 'impactStore');
  const finalCta = getObject(data, 'finalCta');

  return {
    whyDibf: {
      sectionLabel:
        pickString(whyDibf, ['sectionLabel', 'label']) ||
        pickString(data, ['whyDibfSectionLabel', 'whyDibfLabel']),

      sectionTitle:
        pickString(whyDibf, ['sectionTitle', 'title']) ||
        pickString(data, ['whyDibfSectionTitle', 'whyDibfTitle']),

      sectionBody:
        pickString(whyDibf, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['whyDibfSectionBody', 'whyDibfBody']),

      imageUrl:
        pickString(whyDibf, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['whyDibfImageUrl', 'whyDibfImage']),
    },

    coreFocus: {
      sectionLabel:
        pickString(coreFocus, ['sectionLabel', 'label']) ||
        pickString(data, ['coreFocusSectionLabel', 'coreFocusLabel']),

      sectionTitle:
        pickString(coreFocus, ['sectionTitle', 'title']) ||
        pickString(data, ['coreFocusSectionTitle', 'coreFocusTitle']),

      sectionBody:
        pickString(coreFocus, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['coreFocusSectionBody', 'coreFocusBody']),

      imageUrl:
        pickString(coreFocus, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['coreFocusImageUrl', 'coreFocusImage']),
    },

    partnership: {
      sectionLabel:
        pickString(partnership, ['sectionLabel', 'label']) ||
        pickString(data, ['partnershipSectionLabel', 'partnershipLabel']),

      sectionTitle:
        pickString(partnership, ['sectionTitle', 'title']) ||
        pickString(data, ['partnershipSectionTitle', 'partnershipTitle']),

      sectionBody:
        pickString(partnership, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['partnershipSectionBody', 'partnershipBody']),

      imageUrl:
        pickString(partnership, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['partnershipImageUrl', 'partnershipImage']),

      ctaLabel:
        pickString(partnership, ['ctaLabel', 'buttonLabel']) ||
        pickString(data, ['partnershipCtaLabel', 'partnershipButtonLabel']),

      ctaLink:
        pickString(partnership, ['ctaLink', 'buttonLink']) ||
        pickString(data, ['partnershipCtaLink', 'partnershipButtonLink']),
    },

    impactStore: {
      sectionLabel:
        pickString(impactStore, ['sectionLabel', 'label']) ||
        pickString(data, ['impactStoreSectionLabel', 'impactStoreLabel']),

      sectionTitle:
        pickString(impactStore, ['sectionTitle', 'title']) ||
        pickString(data, ['impactStoreSectionTitle', 'impactStoreTitle']),

      sectionBody:
        pickString(impactStore, ['sectionBody', 'body', 'description']) ||
        pickString(data, ['impactStoreSectionBody', 'impactStoreBody']),

      imageUrl:
        pickString(impactStore, ['imageUrl', 'image', 'photoUrl']) ||
        pickString(data, ['impactStoreImageUrl', 'impactStoreImage']),

      ctaLabel:
        pickString(impactStore, ['ctaLabel', 'buttonLabel']) ||
        pickString(data, ['impactStoreCtaLabel', 'impactStoreButtonLabel']),

      ctaLink:
        pickString(impactStore, ['ctaLink', 'buttonLink']) ||
        pickString(data, ['impactStoreCtaLink', 'impactStoreButtonLink']),
    },

    finalCta: {
      sectionLabel:
        pickString(finalCta, ['sectionLabel', 'label']) ||
        pickString(data, ['finalCtaSectionLabel', 'finalCtaLabelText']),

      sectionTitle:
        pickString(finalCta, ['sectionTitle', 'title', 'ctaTitle']) ||
        pickString(data, ['finalCtaTitle', 'ctaTitle']),

      sectionBody:
        pickString(finalCta, [
          'sectionBody',
          'body',
          'ctaBody',
          'description',
        ]) || pickString(data, ['finalCtaBody', 'ctaBody']),

      imageUrl:
        pickString(finalCta, ['imageUrl', 'image']) ||
        pickString(data, ['finalCtaImageUrl', 'finalCtaImage']),

      backgroundImageUrl:
        pickString(finalCta, [
          'backgroundImageUrl',
          'backgroundImage',
          'imageUrl',
          'image',
        ]) ||
        pickString(data, [
          'finalCtaBackgroundImageUrl',
          'finalCtaBackgroundImage',
          'finalCtaImageUrl',
          'finalCtaImage',
        ]),

      ctaLabel:
        pickString(finalCta, ['ctaLabel', 'buttonLabel']) ||
        pickString(data, [
          'finalCtaCtaLabel',
          'finalCtaButtonLabel',
          'finalCtaLabel',
        ]),

      ctaLink:
        pickString(finalCta, ['ctaLink', 'buttonLink']) ||
        pickString(data, [
          'finalCtaCtaLink',
          'finalCtaButtonLink',
          'finalCtaLink',
        ]),
    },
  };
}

function preferIncoming(
  current?: string,
  incoming?: string
): string | undefined {
  return incoming && incoming.trim() ? incoming : current;
}

function mergeSection(
  current: HomepageSectionSettings = {},
  incoming: HomepageSectionSettings = {}
): HomepageSectionSettings {
  return {
    sectionLabel: preferIncoming(current.sectionLabel, incoming.sectionLabel),
    sectionTitle: preferIncoming(current.sectionTitle, incoming.sectionTitle),
    sectionBody: preferIncoming(current.sectionBody, incoming.sectionBody),
    imageUrl: preferIncoming(current.imageUrl, incoming.imageUrl),
    backgroundImageUrl: preferIncoming(
      current.backgroundImageUrl,
      incoming.backgroundImageUrl
    ),
    ctaLabel: preferIncoming(current.ctaLabel, incoming.ctaLabel),
    ctaLink: preferIncoming(current.ctaLink, incoming.ctaLink),
  };
}

function mergeSettings(
  current: HomepageSettings,
  incoming: HomepageSettings
): HomepageSettings {
  return {
    whyDibf: mergeSection(current.whyDibf, incoming.whyDibf),
    coreFocus: mergeSection(current.coreFocus, incoming.coreFocus),
    partnership: mergeSection(current.partnership, incoming.partnership),
    impactStore: mergeSection(current.impactStore, incoming.impactStore),
    finalCta: mergeSection(current.finalCta, incoming.finalCta),
  };
}

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  let mergedSettings: HomepageSettings = {};
  let foundAny = false;

  for (const path of possibleDocPaths) {
    try {
      const snapshot = await adminDb.doc(path).get();

      if (snapshot.exists) {
        const normalized = normalizeHomepageSettings(snapshot.data() || {});
        mergedSettings = mergeSettings(mergedSettings, normalized);
        foundAny = true;
      }
    } catch {
      continue;
    }
  }

  return foundAny ? mergedSettings : null;
}