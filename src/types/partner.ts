import { BaseDocument } from "./firestore";

export type PartnerStatus = "draft" | "published";

export type Partner = BaseDocument & {
  name: string;
  slug: string;
  logoUrl?: string;
  imageUrl?: string;
  websiteUrl?: string;
  description: string;
  partnerType: string;
  order: number;
  status: PartnerStatus;
  featured: boolean;
};