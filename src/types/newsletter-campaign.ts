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
}