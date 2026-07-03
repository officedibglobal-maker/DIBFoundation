
import { BaseDocument, NewsletterCampaignStatus, PaymentStatus, CampaignType } from "./firestore";
import { Timestamp } from "firebase/firestore";

export interface NewsletterCampaign extends BaseDocument {
  title: string;
  campaignType: CampaignType;
  sponsorId?: string;
  sponsorName?: string;
  subject: string;
  preheader: string;
  heroImageUrl?: string;
  content: string;
  ctaLabel: string;
  ctaUrl: string;
  disclosureText: string;
  price: number;
  currency: string;
  paymentStatus: PaymentStatus;
  status: NewsletterCampaignStatus;
  testRecipients?: string[];
  recipientCount?: number;
  sentAt?: Timestamp;
  lastTestSentAt?: Timestamp;
  brevoLastAttemptAt?: Timestamp;
  brevoLastError?: string;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: Timestamp;
}
