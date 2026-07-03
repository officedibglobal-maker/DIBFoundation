
import { collection } from "firebase/firestore";

import { db } from "@/firebase/index";
import { newsletterCampaignConverter } from "./converters";
import { newsletterSettingsConverter } from "./converters";
import { newsletterSubscriberConverter } from "./converters";

export const COLLECTIONS = {
  heroSlides: "heroSlides",
  focusAreas: "focusAreas",
  impactStats: "impactStats",
  initiatives: "initiatives",
  impactStories: "impactStories",
  partners: "partners",
  events: "events",
  news: "news",
  team: "team",
  publications: "publications",
  impactStore: "impactStore",
  impactStoreCategories: "impactStoreCategories",
  impactStoreOrders: "impactStoreOrders",
  impactStoreSettings: "impactStoreSettings",
  contactMessages: "contactMessages",
  volunteerRequests: "volunteerRequests",
  newsletterSubscriptions: "newsletterSubscriptions", // Canonical new-subscriber queue
  newsletterSubscribers: "newsletterSubscribers", // Canonical subscriber list
  newsletterCampaigns: "newsletterCampaigns",
  newsletterSettings: "newsletterSettings",
  newsletterTemplates: "newsletterTemplates",
  donations: "donations",
  donationSettings: "donationSettings",
  siteSettings: "siteSettings",
  siteNavigation: "siteNavigation",
  siteFooter: "siteFooter",
  seoSettings: "seoSettings",
  mediaLibrary: "mediaLibrary",
};

// Root collections
export const newsletterSubscriptionsCollection = collection(
  db,
  COLLECTIONS.newsletterSubscriptions
).withConverter(newsletterSubscriberConverter);

export const newsletterSubscribersCollection = collection(
  db,
  COLLECTIONS.newsletterSubscribers
).withConverter(newsletterSubscriberConverter);

export const newsletterCampaignsCollection = collection(
  db,
  COLLECTIONS.newsletterCampaigns
).withConverter(newsletterCampaignConverter);

export const newsletterSettingsCollection = collection(
  db,
  COLLECTIONS.newsletterSettings
).withConverter(newsletterSettingsConverter);

export const newsletterTemplatesCollection = collection(
  db,
  COLLECTIONS.newsletterTemplates
);
