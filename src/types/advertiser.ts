
import { BaseDocument, AdvertiserStatus } from "./firestore";

export interface Advertiser extends BaseDocument {
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  websiteUrl?: string;
  logoUrl?: string;
  status: AdvertiserStatus;
  notes?: string;
}
