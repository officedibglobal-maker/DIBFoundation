
import {
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
  type WithFieldValue,
} from "firebase/firestore";

import type { Advertiser } from "@/types/advertiser";
import type { NewsletterCampaign } from "@/types/newsletter-campaign";
import type {
  BaseDocument,
  StoredDocument,
} from "@/types/firestore";

export const genericConverter = <T extends BaseDocument>() => ({
  toFirestore(data: WithFieldValue<T>): DocumentData {
    const { id: _id, ...rest } = data;

    return {
      ...rest,
      createdAt: data.createdAt || Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>,
    options?: SnapshotOptions
  ): StoredDocument<T> {
    const data = snapshot.data(options) as T;

    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    } as StoredDocument<T>;
  },
});

export const advertiserConverter =
  genericConverter<Advertiser>();

export const newsletterCampaignConverter =
  genericConverter<NewsletterCampaign>();
