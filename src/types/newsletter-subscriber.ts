
import type {
  FieldValue,
  Timestamp,
} from "firebase/firestore";

import type { BaseDocument } from "@/types/firestore";

export type NewsletterSubscriberStatus =
  | "active"
  | "inactive"
  | "unsubscribed";

export interface NewsletterSubscriber
  extends BaseDocument {
  email: string;
  status: NewsletterSubscriberStatus;
  source?: string;

  subscribedAt?: Timestamp | FieldValue | null;
  unsubscribedAt?: Timestamp | FieldValue | null;

  welcomeEmailSent?: boolean;
  welcomeEmailSentAt?: Timestamp | FieldValue | null;

  brevoMessageId?: string;
  brevoLastAttemptAt?: Timestamp | FieldValue | null;
  brevoContactId?: string | number;
  brevoSyncedAt?: Timestamp | FieldValue | null;
}
