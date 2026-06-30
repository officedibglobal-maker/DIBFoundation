export interface ImpactStoreCategory {
  docId: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  order: number;
  status: "draft" | "published";
  active?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}
