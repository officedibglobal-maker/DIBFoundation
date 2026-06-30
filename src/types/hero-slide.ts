
import { Timestamp } from "firebase/firestore";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  imageAlt: string;
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  textAlignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "center" | "bottom";
  textColor?: "light" | "dark";
  overlayOpacity?: number;
  isActive: boolean;
  order: number;
  publishStartAt?: Timestamp | null;
  publishEndAt?: Timestamp | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
