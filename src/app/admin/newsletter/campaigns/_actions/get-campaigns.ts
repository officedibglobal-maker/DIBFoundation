"use server";

import { adminDb } from "@/firebase/admin";
import { COLLECTIONS } from "@/lib/firestore/collection-names";
import {
  type NewsletterCampaignStatus,
  type SerializedNewsletterCampaign,
} from "@/types/newsletter-campaign";

function serializeDate(value: unknown): string | null {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }

  return null;
}

function normalizeStatus(value: unknown): NewsletterCampaignStatus {
  if (
    value === "draft" ||
    value === "sending" ||
    value === "sent" ||
    value === "failed"
  ) {
    return value;
  }

  return "draft";
}

export async function getCampaigns(): Promise<SerializedNewsletterCampaign[]> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.newsletterCampaigns)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc): SerializedNewsletterCampaign => {
    const data = doc.data();

    return {
      id: doc.id,
      title: typeof data.title === "string" ? data.title : "",
      subject: typeof data.subject === "string" ? data.subject : "",
      previewText:
        typeof data.previewText === "string" ? data.previewText : "",
      bodyHtml: typeof data.bodyHtml === "string" ? data.bodyHtml : "",
      bodyText: typeof data.bodyText === "string" ? data.bodyText : "",
      status: normalizeStatus(data.status),
      recipientCount:
        typeof data.recipientCount === "number" ? data.recipientCount : 0,
      sentCount: typeof data.sentCount === "number" ? data.sentCount : 0,
      failedCount:
        typeof data.failedCount === "number" ? data.failedCount : 0,
      lastError: typeof data.lastError === "string" ? data.lastError : null,
      createdAt: serializeDate(data.createdAt),
      updatedAt: serializeDate(data.updatedAt),
      sentAt: serializeDate(data.sentAt),

      showSponsorBlock: data.showSponsorBlock === true,
      sponsorName:
        typeof data.sponsorName === "string" ? data.sponsorName : "",
      sponsorLabel:
        typeof data.sponsorLabel === "string"
          ? data.sponsorLabel
          : "Sponsored Message",
      sponsorHeadline:
        typeof data.sponsorHeadline === "string" ? data.sponsorHeadline : "",
      sponsorBody:
        typeof data.sponsorBody === "string" ? data.sponsorBody : "",
      sponsorCtaLabel:
        typeof data.sponsorCtaLabel === "string" ? data.sponsorCtaLabel : "",
      sponsorCtaUrl:
        typeof data.sponsorCtaUrl === "string" ? data.sponsorCtaUrl : "",
      sponsorImageUrl:
        typeof data.sponsorImageUrl === "string" ? data.sponsorImageUrl : "",
    };
  });
}