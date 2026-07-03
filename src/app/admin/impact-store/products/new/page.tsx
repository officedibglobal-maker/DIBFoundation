
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm';
import { ImpactStoreCategory } from '@/types/impact-store-category';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { collection, addDoc, serverTimestamp, getDocs, query } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { useStorage } from '@/firebase/storage/use-storage';
import { useToast } from '@/hooks/use-toast';
import { impactStoreProductConverter } from '@/lib/firestore/converters';
import { ImpactStoreProduct, ProductUploadFiles } from '@/types/impact-store-product';
import { StoredDocument } from '@/types/firestore';

export default function NewProductPage() {
  const { db } = useFirestore();
  const { uploadFile, uploading: imageUploading } = useStorage();
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState<StoredDocument<ImpactStoreCategory>[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  const categoriesCollectionRef = useMemo(() =>
    db ? collection(db, COLLECTIONS.impactStoreCategories) : null,
    [db]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      if (!categoriesCollectionRef) return;
      try {
        const snapshot = await getDocs(categoriesCollectionRef);
        const activeCategories = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                slug: data.slug,
                order: data.order,
                status: data.status,
                description: data.description,
            } as StoredDocument<ImpactStoreCategory>

        });
        setCategories(activeCategories);
      } catch (err) {
        console.error(err);
        toast({ title: "Error loading categories", description: (err as Error).message, variant: "destructive" });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [categoriesCollectionRef, toast]);

  const handleSave = async (productData: ProductFormData, files: ProductUploadFiles) => {
    if (!db) {
      toast({ title: "Error", description: "Database not available.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = '';
      const { primaryImage, galleryImages } = files;

      if (primaryImage) {
        const imagePath = `impact-store/products/${Date.now()}_${primaryImage.name}`;
        const uploadedUrl = await uploadFile(primaryImage, imagePath);
        if (!uploadedUrl) throw new Error('Image upload failed.');
        imageUrl = uploadedUrl;
      }

      const productsRef = collection(db, COLLECTIONS.impactStore).withConverter(impactStoreProductConverter);

      const newProduct: Omit<ImpactStoreProduct, 'id'> = {
        ...productData,
        imageUrl: imageUrl,
        images: [], // Placeholder for multiple images if needed
        active: true,
        published: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(productsRef, newProduct);

      toast({ title: "Success", description: "Product created successfully." });
      router.push('/admin/impact-store/products');
    } catch (error) {
      console.error("Failed to create product:", error);
      toast({ title: "Error", description: `Failed to create product: ${(error as Error).message}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loadingCategories) {
    return <p>Loading categories...</p>;
  }

  return (
    <div>
      <AdminPageHeader title="Add New Product" />
      <ProductForm
        categories={categories}
        onSave={handleSave}
        saving={saving || imageUploading}
      />
    </div>
  );
}
