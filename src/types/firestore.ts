
import { FieldValue, Timestamp } from "firebase/firestore";

export type ContentStatus = "draft" | "published" | "archived";

export interface BaseDocument {
  id?: string;
  createdAt?: Timestamp | FieldValue | null;
  updatedAt?: Timestamp | FieldValue | null;
}

export interface StoredDocument extends BaseDocument {
  id: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export type DocumentWrite<T> = Omit<T, "id" | "createdAt" | "updatedAt"> & {
  createdAt?: Timestamp | FieldValue | null;
  updatedAt?: Timestamp | FieldValue | null;
};

export interface HeroSlide extends BaseDocument {
  title: string;
  subtitle: string;
  body?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  imageAlt?: string;
  overlayStrength?: number;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  order: number;
  status: ContentStatus;
  /** @deprecated legacy field */
  ctaText?: string;
  /** @deprecated legacy field */
  ctaUrl?: string;
}

export interface FocusArea extends BaseDocument {
  title: string;
  slug: string;
  summary: string;
  description: string;
  iconName: string;
  imageUrl: string;
  imageAlt: string;
  accentStyle: string;
  ctaLabel: string;
  ctaHref: string;
  order: number;
  status: ContentStatus;
}

export interface ImpactStory extends BaseDocument {
  title: string;
  excerpt: string;
  summary: string;
  content: string;
  imageUrl: string;
  featured: boolean;
  status: ContentStatus;
}

export interface Initiative extends BaseDocument {
  title: string;
  summary: string;
  imageUrl: string;
  order: number;
  status: ContentStatus;
}

export interface Stat extends BaseDocument {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  iconName?: string;
  order: number;
}

export interface ImpactStatViewModel {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  iconName?: string;
  order: number;
}

export interface Event extends BaseDocument {
  title: string;
  date: Timestamp;
  location: string;
  description: string;
}

export interface NavigationItem extends BaseDocument {
  title: string;
  path: string;
  order: number;
  isExternal: boolean;
}

export interface News extends BaseDocument {
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  publishedAt: Timestamp;
}

export interface Page extends BaseDocument {
  title: string;
  slug: string;
  content: string;
}

export interface Partner extends BaseDocument {
  name: string;
  logoUrl: string;
  website: string;
}

export interface TeamMember extends BaseDocument {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface Campaign extends BaseDocument {
  name: string;
  subject: string;
  content: string;
  sentAt?: Timestamp;
}

export interface Subscriber extends BaseDocument {
  email: string;
  firstName?: string;
  lastName?: string;
}
