
import {
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
  FieldValue,
  serverTimestamp
} from "firebase/firestore";

import type { Advertiser } from "@/types/advertiser";
import type { NewsletterCampaign } from "@/types/newsletter-campaign";
import type { NewsletterSettings } from "@/types/newsletter-settings";
import type { NewsletterSubscriber } from "@/types/newsletter-subscriber";
import type {
  BaseDocument
} from "@/types/firestore";
import { ImpactStoreCategory } from "@/types/impact-store-category";
import { ImpactStoreProduct } from "@/types/impact-store-product";

// A generic converter that handles the 'id' and timestamps.
export const genericConverter = <T extends BaseDocument>() => ({
  toFirestore(data: WithFieldValue<T>): DocumentData {
    const { id, ...rest } = data;
    const now = Timestamp.now();

    const createdAt = data.createdAt instanceof FieldValue ? data.createdAt : now;

    return {
      ...rest,
      createdAt,
      updatedAt: serverTimestamp(),
      sentAt: null,
      status: "draft",
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

export const advertiserConverter =
  genericConverter<Advertiser>();

export const newsletterCampaignConverter = {
  toFirestore(data: WithFieldValue<NewsletterCampaign>): DocumentData {
    const { id, ...rest } = data;
    const now = Timestamp.now();

    const createdAt = data.createdAt instanceof FieldValue ? data.createdAt : now;

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
