import { BaseDocument } from "./firestore";

export type HomepageSettings = BaseDocument & {
  // Partnership Section
  partnershipLabel?: string;
  partnershipTitle?: string;
  partnershipBody?: string;
  partnershipImageUrl?: string;
  partnershipCtaLabel?: string;
  partnershipCtaLink?: string;

  // Impact Store Section
  impactStoreLabel?: string;
  impactStoreTitle?: string;
  impactStoreBody?: string;
  impactStoreImageUrl?: string;
  impactStoreCtaLabel?: string;
  impactStoreCtaLink?: string;

  // Final CTA Section
  finalCtaTitle?: string;
  finalCtaBody?: string;
  finalCtaBackgroundImageUrl?: string;
  finalCtaPrimaryLabel?: string;
  finalCtaPrimaryLink?: string;
  finalCtaSecondaryLabel?: string;
  finalCtaSecondaryLink?: string;
};