
import { ImpactStoreCategory } from "@/types/impact-store-category";
import { ImpactStoreProduct, ImpactStoreProductStatus } from "@/types/impact-store-product";
import {
  type DocumentData,
  type FirestoreDataConverter,
  type PartialWithFieldValue,
  type QueryDocumentSnapshot,
  type SetOptions,
  type SnapshotOptions,
  type WithFieldValue,
  serverTimestamp
} from "firebase/firestore";
import type { BaseDocument } from "@/types/firestore";

export function genericConverter<
  T extends BaseDocument
>(): FirestoreDataConverter<T> {
  return {
    toFirestore(
      modelObject: WithFieldValue<T>
    ): DocumentData {
      const data = {
        ...modelObject,
      } as Record<string, unknown>;

      // Firestore document IDs are metadata and should not be
      // duplicated into every document unless the existing schema
      // intentionally requires them.
      delete data.id;

      return data;
    },

    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options: SnapshotOptions
    ): T {
      const data = snapshot.data(options);

      return {
        ...data,
        id: snapshot.id,
      } as T;
    },
  };
}

function impactStoreProductToFirestore(
  product: WithFieldValue<ImpactStoreProduct>
): DocumentData;

function impactStoreProductToFirestore(
  product: PartialWithFieldValue<ImpactStoreProduct>,
  options: SetOptions
): DocumentData;

function impactStoreProductToFirestore(
  product: | WithFieldValue<ImpactStoreProduct> | PartialWithFieldValue<ImpactStoreProduct>,
  options?: SetOptions
): DocumentData {
  const data: DocumentData = { ...product };

  delete data.id;
  delete data.docId;

  return data;
}

export const impactStoreProductConverter: FirestoreDataConverter<ImpactStoreProduct> = {
  toFirestore: impactStoreProductToFirestore,
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): ImpactStoreProduct {
    const data = snapshot.data(options);

    // Safely normalize data
    const status: ImpactStoreProductStatus = data.status && ["published", "draft", "archived"].includes(data.status) ? data.status : "draft";

    return {
      docId: snapshot.id,
      id: snapshot.id,
      name: data.name || "",
      slug: data.slug || "",
      description: data.description || "",
      shortDescription: data.shortDescription || "",
      price: typeof data.price === "number" ? data.price : 0,
      currency: data.currency || "GHS",
      categoryId: data.categoryId || "",
      categoryName: data.categoryName || "",
      imageUrl: data.imageUrl || "",
      images: Array.isArray(data.images) ? data.images : [],
      stockQuantity: typeof data.stockQuantity === "number" ? data.stockQuantity : 0,
      status: status,
      featured: !!data.featured,
      order: typeof data.order === "number" ? data.order : 0,
      active: !!data.active,
      published: !!data.published,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as ImpactStoreProduct;
  },
};

function impactStoreCategoryToFirestore(
  category: WithFieldValue<ImpactStoreCategory>
): DocumentData;

function impactStoreCategoryToFirestore(
  category: PartialWithFieldValue<ImpactStoreCategory>,
  options: SetOptions
): DocumentData;

function impactStoreCategoryToFirestore(
  category: | WithFieldValue<ImpactStoreCategory> | PartialWithFieldValue<ImpactStoreCategory>,
  options?: SetOptions
): DocumentData {
  const data: DocumentData = { ...category };

  delete data.id;
  delete data.docId;

  return data;
}

export const impactStoreCategoryConverter: FirestoreDataConverter<ImpactStoreCategory> = {
  toFirestore: impactStoreCategoryToFirestore,
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): ImpactStoreCategory {
    const data = snapshot.data(options);

    return {
      ...data,
      id: snapshot.id,
      docId: snapshot.id,
    } as ImpactStoreCategory;
  },
};
