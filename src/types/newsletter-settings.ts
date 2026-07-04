import type { BaseDocument } from "@/types/firestore";

export interface NewsletterSettings extends BaseDocument {
  senderName: string;
  senderEmail: string;
  replyToEmail?: string;

  organizationName: string;
  organizationAddress?: string;

  defaultPreviewText?: string;
  defaultFooterHtml?: string;
  unsubscribeText?: string;

  brevoListId?: number;
  testRecipientEmails?: string[];

  welcomeEmailEnabled?: boolean;
  campaignApprovalRequired?: boolean;
}