
import { BaseDocument, ContentStatus } from "./firestore";

export type ImpactStoreProductStatus = ContentStatus;

export interface ImpactStoreProduct extends BaseDocument {
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
}

export interface ProductUploadFiles {
    primaryImage?: File;
    galleryImages?: File[];
}
