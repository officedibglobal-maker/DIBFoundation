
export type ImpactStoreProductStatus =
  | "draft"
  | "published"
  | "archived";

export interface ImpactStoreProduct {
  docId: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  images: string[];
  stockQuantity: number;
  status: ImpactStoreProductStatus;
  featured: boolean;
  order: number;
  active: boolean;
  published: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface ProductUploadFiles {
  primaryImage?: File;
  galleryImages: File[];
}
