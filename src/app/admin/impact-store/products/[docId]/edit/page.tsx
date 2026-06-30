
'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm';
import { ImpactStoreCategory } from '@/types/impact-store-category';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { useStorage } from '@/firebase/storage/use-storage';
import { useToast } from '@/hooks/use-toast';
import { impactStoreProductConverter } from '@/lib/firestore/converters';
import { ImpactStoreProduct, ProductUploadFiles } from '@/types/impact-store-product';

export default function EditProductPage() {
  const { db } = useFirestore();
  const { uploadFile, uploading: imageUploading } = useStorage();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { docId } = params;

  const [product, setProduct] = useState<ImpactStoreProduct | null>(null);
  const [categories, setCategories] = useState<ImpactStoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const productDocRef = useMemo(() => 
    db && docId ? doc(db, COLLECTIONS.impactStore, docId as string).withConverter(impactStoreProductConverter) : null,
    [db, docId]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!productDocRef) return;
      try {
        const productSnap = await getDoc(productDocRef);
        if (!productSnap.exists()) {
          toast({ title: "Error", description: "Product not found.", variant: "destructive" });
          router.push('/admin/impact-store/products');
          return;
        }
        setProduct(productSnap.data());

        if (db) {
          const categoriesRef = collection(db, COLLECTIONS.impactStoreCategories);
          const categoriesSnap = await getDocs(categoriesRef);
          setCategories(categoriesSnap.docs.map(doc => ({ ...doc.data(), docId: doc.id })) as ImpactStoreCategory[]);
        }

      } catch (err) {
        console.error(err);
        toast({ title: "Error loading data", description: (err as Error).message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [db, productDocRef, router, toast]);

  const handleSave = async (productData: ProductFormData, files: ProductUploadFiles) => {
    if (!db || !productDocRef) {
      toast({ title: "Error", description: "Database not available or product reference is missing.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let imageUrl = productData.imageUrl;
      const { primaryImage, galleryImages } = files;

      if (primaryImage) {
        const imagePath = `impact-store/products/${Date.now()}_${primaryImage.name}`;
        const uploadedUrl = await uploadFile(primaryImage, imagePath);
        if (!uploadedUrl) throw new Error('Image upload failed.');
        imageUrl = uploadedUrl;
      }

      const updatedData = { ...productData, imageUrl, updatedAt: serverTimestamp() };
      await updateDoc(productDocRef, updatedData);

      toast({ title: "Success", description: "Product updated successfully." });
      router.push('/admin/impact-store/products');
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({ title: "Error", description: `Failed to update product: ${(error as Error).message}`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
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
