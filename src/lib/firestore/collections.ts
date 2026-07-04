import { collection } from "firebase/firestore";

import { db } from "@/firebase/index";
import {
  newsletterCampaignConverter,
  newsletterSettingsConverter,
  newsletterSubscriberConverter,
} from "@/lib/firestore/converters";
import { COLLECTIONS } from "@/lib/firestore/collection-names";

export { COLLECTIONS } from "@/lib/firestore/collection-names";

export const newsletterSubscriptionsCollection =
  collection(
    db,
    COLLECTIONS.newsletterSubscriptions,
  ).withConverter(newsletterSubscriberConverter);

/**
 * Legacy subscriber collection.
 *
 * New subscription and subscriber-management code should use
 * newsletterSubscriptionsCollection.
 */
export const newsletterSubscribersCollection =
  collection(
    db,
    COLLECTIONS.newsletterSubscribers,
  ).withConverter(newsletterSubscriberConverter);

export const newsletterCampaignsCollection =
  collection(
    db,
    COLLECTIONS.newsletterCampaigns,
  ).withConverter(newsletterCampaignConverter);

export const newsletterSettingsCollection =
  collection(
    db,
    COLLECTIONS.newsletterSettings,
  ).withConverter(newsletterSettingsConverter);

export const newsletterTemplatesCollection =
  collection(
    db,
    COLLECTIONS.newsletterTemplates,
  );