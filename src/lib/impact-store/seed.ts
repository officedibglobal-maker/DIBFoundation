import {
  collection,
  writeBatch,
  getDocs,
  query,
  where,
  type Firestore,
  doc,
  serverTimestamp,
  type WithFieldValue,
} from "firebase/firestore";

import { impactStoreProductConverter } from "@/lib/firestore/converters";
import { type ImpactStoreProduct } from "@/types/impact-store-product";
import { type ImpactStoreCategory } from "@/types/impact-store-category";
import { COLLECTIONS } from "@/lib/firestore/collections";

export type SeedImpactStoreResult = {
  categoriesCreated: number;
  categoriesSkipped: number;
  productsCreated: number;
  productsSkipped: number;
};

const categories: Omit<
  ImpactStoreCategory,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Apparel",
    slug: "apparel",
    description: "Clothing items",
    imageUrl: "/images/impact-store/dibf-hope-tshirt.svg",
    order: 1,
    status: "published",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Things you can wear or carry",
    imageUrl: "/images/impact-store/dibf-tote-bag.svg",
    order: 2,
    status: "published",
  },
  {
    name: "Drinkware",
    slug: "drinkware",
    description: "Mugs, bottles, and more",
    imageUrl: "/images/impact-store/dibf-impact-mug.svg",
    order: 3,
    status: "published",
  },
  {
    name: "Stationery",
    slug: "stationery",
    description: "Notebooks, pens, and other supplies",
    imageUrl: "/images/impact-store/dibf-notebook.svg",
    order: 4,
    status: "published",
  },
];

const products: Omit<
  ImpactStoreProduct,
  "id" | "createdAt" | "updatedAt" | "categoryId" | "categoryName"
>[] = [
  {
    name: "DIBF Hope T-Shirt",
    slug: "dibf-hope-tshirt",
    price: 150,
    description:
      "A premium navy cotton T-shirt created for supporters of the DIB Foundation. Every purchase contributes to programmes that improve lives and strengthen communities.",
    shortDescription: "Wear hope and support community transformation.",
    imageUrl: "/images/impact-store/dibf-hope-tshirt.svg",
    images: [],
    stockQuantity: 35,
    status: "published",
    featured: true,
    order: 1,
    currency: "GHS",
    active: true,
    published: true,
  },
  {
    name: "DIBF Impact Mug",
    slug: "dibf-impact-mug",
    price: 75,
    description:
      "A durable ceramic mug featuring DIBF impact branding. Suitable for home, work or as a meaningful gift.",
    shortDescription: "Start every day with purpose.",
    imageUrl: "/images/impact-store/dibf-impact-mug.svg",
    images: [],
    stockQuantity: 48,
    status: "published",
    featured: true,
    order: 2,
    currency: "GHS",
    active: true,
    published: true,
  },
  {
    name: "DIBF Everyday Tote Bag",
    slug: "dibf-everyday-tote-bag",
    price: 95,
    description:
      "A strong reusable canvas tote bag designed for everyday use while helping to spread the DIBF message of hope and service.",
    shortDescription: "Carry hope wherever you go.",
    imageUrl: "/images/impact-store/dibf-tote-bag.svg",
    images: [],
    stockQuantity: 27,
    status: "published",
    featured: true,
    order: 3,
    currency: "GHS",
    active: true,
    published: true,
  },
  {
    name: "DIBF Impact Notebook",
    slug: "dibf-impact-notebook",
    price: 60,
    description:
      "A premium hard-cover notebook for planning, journaling and recording ideas that create positive social impact.",
    shortDescription: "Capture ideas that can change lives.",
    imageUrl: "/images/impact-store/dibf-notebook.svg",
    images: [],
    stockQuantity: 42,
    status: "published",
    featured: false,
    order: 4,
    currency: "GHS",
    active: true,
    published: true,
  },
  {
    name: "DIBF Volunteer Cap",
    slug: "dibf-volunteer-cap",
    price: 85,
    description:
      "An adjustable navy volunteer cap with clean embroidered-style DIBF branding, suitable for outreach events and everyday wear.",
    shortDescription: "Represent service, hope and community.",
    imageUrl: "/images/impact-store/dibf-cap.svg",
    images: [],
    stockQuantity: 22,
    status: "published",
    featured: false,
    order: 5,
    currency: "GHS",
    active: true,
    published: true,
  },
  {
    name: "DIBF Impact Wristband Set",
    slug: "dibf-impact-wristband-set",
    price: 35,
    description:
      "A set of blue and gold silicone wristbands carrying positive DIBF messages about hope, compassion and purposeful action.",
    shortDescription: "A simple reminder to make an impact.",
    imageUrl: "/images/impact-store/dibf-wristband-set.svg",
    images: [],
    stockQuantity: 70,
    status: "published",
    featured: false,
    order: 6,
    currency: "GHS",
    active: true,
    published: true,
  },
];

export async function seedImpactStore(
  db: Firestore,
): Promise<SeedImpactStoreResult> {
  const batch = writeBatch(db);

  let categoriesCreated = 0;
  let categoriesSkipped = 0;

  const categoriesCollectionRef = collection(
    db,
    COLLECTIONS.impactStoreCategories,
  );

  console.info(
    "Impact Store categories collection:",
    categoriesCollectionRef.path,
  );

  for (const categoryData of categories) {
    const categoryQuery = query(
      categoriesCollectionRef,
      where("slug", "==", categoryData.slug),
    );

    const snapshot = await getDocs(categoryQuery);

    if (snapshot.empty) {
      const categoryDocRef = doc(categoriesCollectionRef);

      batch.set(categoryDocRef, {
        ...categoryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      categoriesCreated += 1;
    } else {
      categoriesSkipped += 1;
    }
  }

  let productsCreated = 0;
  let productsSkipped = 0;

  const productsCollectionRef = collection(
    db,
    COLLECTIONS.impactStore,
  ).withConverter(impactStoreProductConverter);

  const categoriesRefForProduct = collection(
    db,
    COLLECTIONS.impactStoreCategories,
  );

  console.info(
    "Impact Store products collection:",
    productsCollectionRef.path,
  );

  for (const productData of products) {
    const productQuery = query(
      productsCollectionRef,
      where("slug", "==", productData.slug),
    );

    const existingProducts = await getDocs(productQuery);

    if (!existingProducts.empty) {
      productsSkipped += 1;
      continue;
    }

    const categoryName =
      productData.slug.includes("t-shirt") ||
      productData.slug.includes("cap")
        ? "Apparel"
        : productData.slug.includes("mug")
          ? "Drinkware"
          : productData.slug.includes("tote-bag") ||
              productData.slug.includes("wristband")
            ? "Accessories"
            : "Stationery";

    const categoryQuery = query(
      categoriesRefForProduct,
      where("name", "==", categoryName),
    );

    const categorySnapshot = await getDocs(categoryQuery);

    if (categorySnapshot.empty) {
      console.warn(
        `Skipping product "${productData.name}" because category "${categoryName}" was not found.`,
      );

      productsSkipped += 1;
      continue;
    }

    const categoryDoc = categorySnapshot.docs[0];
    const categoryData = categoryDoc.data();

    const product: WithFieldValue<ImpactStoreProduct> = {
      ...productData,
      categoryId: categoryDoc.id,
      categoryName:
        typeof categoryData.name === "string"
          ? categoryData.name
          : categoryName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const productDocRef = doc(productsCollectionRef);

    batch.set(productDocRef, product);
    productsCreated += 1;
  }

  await batch.commit();

  return {
    categoriesCreated,
    categoriesSkipped,
    productsCreated,
    productsSkipped,
  };
}