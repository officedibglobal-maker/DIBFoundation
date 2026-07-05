import {
  Timestamp,
  type DocumentData,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  type SetOptions,
  type SnapshotOptions,
  type WithFieldValue,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore";

import type { Advertiser } from "@/types/advertiser";
import type { NewsletterCampaign } from "@/types/newsletter-campaign";
import type { NewsletterSettings } from "@/types/newsletter-settings";
import type { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import type { BaseDocument } from "@/types/firestore";
import type { ImpactStoreCategory } from "@/types/impact-store-category";
import type { ImpactStoreProduct } from "@/types/impact-store-product";
import type { SitePage } from "@/lib/models/site-pages";

// A generic converter that handles the "id" field and timestamps.
export const genericConverter = <T extends BaseDocument>() => ({
  toFirestore(data: WithFieldValue<T>): DocumentData {
    const { id, ...rest } = data;
    const now = Timestamp.now();

    const createdAt =
      data.createdAt instanceof FieldValue
        ? data.createdAt
        : data.createdAt || now;

    return {
      ...rest,
      createdAt,
      updatedAt: serverTimestamp(),
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): T {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      ...data,
    } as T;
  },
});

export const advertiserConverter = genericConverter<Advertiser>();

export const newsletterCampaignConverter: FirestoreDataConverter<NewsletterCampaign> =
  {
    toFirestore(data: WithFieldValue<NewsletterCampaign>): DocumentData {
      const { id, ...rest } = data;
      const now = Timestamp.now();

      const createdAt =
        data.createdAt instanceof FieldValue
          ? data.createdAt
          : data.createdAt || now;

      return {
        ...rest,
        createdAt,
        updatedAt: serverTimestamp(),
        sentAt: data.sentAt ? data.sentAt : null,
        status: data.status ? data.status : "draft",
      };
    },

    fromFirestore(
      snapshot: QueryDocumentSnapshot<DocumentData>,
      options?: SnapshotOptions
    ): NewsletterCampaign {
      const data = snapshot.data(options);

      return {
        id: snapshot.id,
        ...data,
      } as NewsletterCampaign;
    },
  };

export const newsletterSettingsConverter =
  genericConverter<NewsletterSettings>();

export const newsletterSubscriberConverter =
  genericConverter<NewsletterSubscriber>();

export const impactStoreCategoryConverter =
  genericConverter<ImpactStoreCategory>();

export const impactStoreProductConverter =
  genericConverter<ImpactStoreProduct>();

function sitePageToFirestore(sitePage: WithFieldValue<SitePage>): DocumentData;
function sitePageToFirestore(
  sitePage: PartialWithFieldValue<SitePage>,
  options: SetOptions
): DocumentData;
function sitePageToFirestore(
  sitePage: WithFieldValue<SitePage> | PartialWithFieldValue<SitePage>,
  _options?: SetOptions
): DocumentData {
  const page = sitePage as PartialWithFieldValue<SitePage> & {
    id?: unknown;
    createdAt?: unknown;
  };

  const { id, ...rest } = page;

  return {
    ...rest,
    createdAt: page.createdAt ?? Timestamp.now(),
    updatedAt: serverTimestamp(),
  };
}

export const sitePageConverter: FirestoreDataConverter<SitePage> = {
  toFirestore: sitePageToFirestore,

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): SitePage {
    const data = snapshot.data(options) as Partial<SitePage>;

    return {
      id: snapshot.id,
      slug:
        typeof data.slug === "string" && data.slug.length > 0
          ? data.slug
          : snapshot.id,
      title:
        typeof data.title === "string" && data.title.length > 0
          ? data.title
          : "Untitled Page",
      subtitle: data.subtitle ?? "",
      eyebrow: data.eyebrow ?? "",
      heroImageUrl: data.heroImageUrl ?? "",
      status: data.status === "draft" ? "draft" : "published",
      sections: Array.isArray(data.sections) ? data.sections : [],
      ctas: Array.isArray(data.ctas) ? data.ctas : [],
      seoTitle: data.seoTitle ?? "",
      seoDescription: data.seoDescription ?? "",
      order: typeof data.order === "number" ? data.order : 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};