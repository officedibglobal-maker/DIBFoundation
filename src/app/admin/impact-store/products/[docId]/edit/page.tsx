"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  type PartialWithFieldValue,
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  ProductForm,
  type ProductFormData,
} from "@/components/admin/ProductForm";
import { useFirestore } from "@/firebase/firestore/use-firestore";
import { useStorage } from "@/firebase/storage/use-storage";
import { useToast } from "@/hooks/use-toast";
import { COLLECTIONS } from "@/lib/firestore/collections";
import {
  impactStoreCategoryConverter,
  impactStoreProductConverter,
} from "@/lib/firestore/converters";
import {
  type ImpactStoreProduct,
  type ProductUploadFiles,
} from "@/types/impact-store-product";
import { type ImpactStoreCategory } from "@/types/impact-store-category";

export default function EditProductPage() {
  const { db } = useFirestore();
  const { uploadFile, uploading: imageUploading } = useStorage();
  const router = useRouter();
  const params = useParams<{ docId: string }>();
  const { toast } = useToast();

  const docId = params.docId;

  const [product, setProduct] =
    useState<ImpactStoreProduct | null>(null);
  const [categories, setCategories] =
    useState<ImpactStoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const productDocRef = useMemo(() => {
    if (!db || !docId) {
      return null;
    }

    return doc(
      db,
      COLLECTIONS.impactStore,
      docId,
    ).withConverter(impactStoreProductConverter);
  }, [db, docId]);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (!db || !productDocRef) {
        return;
      }

      setLoading(true);

      try {
        const categoriesRef = collection(
          db,
          COLLECTIONS.impactStoreCategories,
        ).withConverter(impactStoreCategoryConverter);

        const [productSnapshot, categoriesSnapshot] =
          await Promise.all([
            getDoc(productDocRef),
            getDocs(categoriesRef),
          ]);

        if (cancelled) {
          return;
        }

        if (!productSnapshot.exists()) {
          toast({
            title: "Product not found",
            description:
              "The requested Impact Store product could not be found.",
            variant: "destructive",
          });

          router.replace("/admin/impact-store/products");
          return;
        }

        setProduct(productSnapshot.data());
        setCategories(
          categoriesSnapshot.docs.map((categoryDocument) =>
            categoryDocument.data(),
          ),
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to load product data:", error);

        toast({
          title: "Error loading product",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading the product.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [db, productDocRef, router, toast]);

  async function handleSave(
    productData: ProductFormData,
    files: ProductUploadFiles,
  ) {
    if (!productDocRef || !docId) {
      toast({
        title: "Database unavailable",
        description:
          "The product reference is unavailable. Refresh the page and try again.",
        variant: "destructive",
      });

      return;
    }

    setSaving(true);

    try {
      const primaryImage = files.primaryImage;
      const galleryImages = files.galleryImages ?? [];

      let imageUrl = productData.imageUrl;
      let images = productData.images ?? [];

      if (primaryImage) {
        const imagePath =
          `impact-store/products/${docId}/primary/` +
          `${Date.now()}-${primaryImage.name}`;

        const uploadedUrl = await uploadFile(
          primaryImage,
          imagePath,
        );

        if (!uploadedUrl) {
          throw new Error("The primary image upload failed.");
        }

        imageUrl = uploadedUrl;
      }

      if (galleryImages.length > 0) {
        const uploadedGalleryUrls = await Promise.all(
          galleryImages.map(async (file, index) => {
            const imagePath =
              `impact-store/products/${docId}/gallery/` +
              `${Date.now()}-${index}-${file.name}`;

            const uploadedUrl = await uploadFile(
              file,
              imagePath,
            );

            if (!uploadedUrl) {
              throw new Error(
                `The gallery image "${file.name}" could not be uploaded.`,
              );
            }

            return uploadedUrl;
          }),
        );

        images = [...images, ...uploadedGalleryUrls];
      }

      const updatedData: PartialWithFieldValue<ImpactStoreProduct> = {
        ...productData,
        imageUrl,
        images,
        updatedAt: serverTimestamp(),
      };

      await setDoc(productDocRef, updatedData, {
        merge: true,
      });

      toast({
        title: "Product updated",
        description: `${productData.name} was updated successfully.`,
      });

      router.push("/admin/impact-store/products");
      router.refresh();
    } catch (error) {
      console.error("Failed to update product:", error);

      toast({
        title: "Error updating product",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while updating the product.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit Product" />

        <p className="text-sm text-muted-foreground">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Edit Product" />

        <p className="text-sm text-muted-foreground">
          Product details are unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Edit Product" />

      <ProductForm
        product={product}
        categories={categories}
        onSave={handleSave}
        saving={saving || imageUploading}
      />
    </div>
  );
}