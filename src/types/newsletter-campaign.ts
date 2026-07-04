import type { FieldValue, Timestamp } from "firebase/firestore";

import type { BaseDocument } from "@/types/firestore";

export type NewsletterCampaignStatus =
  | "draft"
  | "sending"
  | "sent"
  | "failed";

export interface NewsletterCampaign extends BaseDocument {
  title: string;
  subject: string;
  previewText?: string;
  bodyHtml: string;
  bodyText?: string;
  status: NewsletterCampaignStatus;
  recipientCount?: number;
  sentCount?: number;
  failedCount?: number;
  lastError?: string | null;
  sentAt?: Timestamp | FieldValue | null;

  showSponsorBlock?: boolean;
  sponsorName?: string;
  sponsorLabel?: string;
  sponsorHeadline?: string;
  sponsorBody?: string;
  sponsorCtaLabel?: string;
  sponsorCtaUrl?: string;
  sponsorImageUrl?: string;
}

export interface SerializedNewsletterCampaign {
  id?: string;
  title: string;
  subject: string;
  previewText?: string;
  bodyHtml: string;
  bodyText?: string;
  status: NewsletterCampaignStatus;
  recipientCount?: number;
  sentCount?: number;
  failedCount?: number;
  lastError?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  sentAt?: string | null;

  showSponsorBlock?: boolean;
  sponsorName?: string;
  sponsorLabel?: string;
  sponsorHeadline?: string;
  sponsorBody?: string;
  sponsorCtaLabel?: string;
  sponsorCtaUrl?: string;
  sponsorImageUrl?: string;
}