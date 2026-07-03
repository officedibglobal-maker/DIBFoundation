
import type {
  FieldValue,
  Timestamp,
} from "firebase/firestore";

import type { BaseDocument } from "@/types/firestore";

export interface NewsletterSettings
  extends BaseDocument {
  senderName?: string;
  senderEmail?: string;

  replyToName?: string;
  replyToEmail?: string;

  brevoListId?: string | number;

  defaultTemplateId?: string;

  footerContent?: string;
  unsubscribeContent?: string;
  organizationAddress?: string;

  testRecipients?: string[];

  updatedAt?: Timestamp | FieldValue;
}
