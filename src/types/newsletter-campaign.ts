
import type {
  FieldValue,
  Timestamp,
} from "firebase/firestore";

import type { BaseDocument } from "@/types/firestore";

export type NewsletterCampaignStatus =
  | "draft"
  | "scheduled"
  | "sending"
  | "sent"
  | "failed"
  | "archived";

export interface NewsletterCampaign
  extends BaseDocument {
  name: string;
  subject: string;
  fromName?: string;
  fromEmail?: string;

  htmlContent?: string;
  plainTextContent?: string;

  status: NewsletterCampaignStatus;

  audience?: Record<string, any>; // Consider defining a specific type

  createdAt?: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  scheduledAt?: Timestamp | FieldValue | null;
  sentAt?: Timestamp | FieldValue | null;

  brevoCampaignId?: string | number;
  brevoMessageId?: string;
  brevoLastAttemptAt?: Timestamp | FieldValue | null;
  brevoLastError?: string;
}
