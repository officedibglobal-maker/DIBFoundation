
import { BaseDocument, ContentStatus } from "./firestore";

export interface ImpactStoreCategory extends BaseDocument {
    name: string;
    slug: string;
    description: string;
    order: number;
    status: ContentStatus;
    imageUrl: string;
}
