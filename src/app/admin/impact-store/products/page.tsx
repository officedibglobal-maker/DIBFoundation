
'use client';

import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import AdminDataTable from '@/components/admin/AdminDataTable';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/firebase/firestore/use-collection';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { ImpactStoreProduct } from '@/types/impact-store-product';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import { impactStoreProductConverter } from '@/lib/firestore/converters';
import { SeedProductsButton } from './seed-products-button';
import { useToast } from '@/hooks/use-toast';

export default function AdminProductsPage() {
  const { db } = useFirestore();
  const { toast } = useToast();

  const productsQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, COLLECTIONS.impactStore).withConverter(impactStoreProductConverter),
      orderBy('order', 'asc')
    );
  }, [db]);

  const { data: products, loading, error } = useCollection<ImpactStoreProduct>(productsQuery);

  useEffect(() => {
    if (error) {
      console.error("Failed to load Impact Store products:", error);
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (!loading) {
      console.info("Loaded admin products:", products.length);
    }
  }, [loading, products]);

  const columns = [
    { key: 'name', label: 'Product Name' },
    { key: 'categoryName', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stockQuantity', label: 'Stock' },
    { key: 'status', label: 'Status' },
  ];

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <AdminPageHeader title="Impact Store Products">
        <div className="flex flex-wrap items-center gap-3">
          <SeedProductsButton />

          <Button asChild>
            <Link href="/admin/impact-store/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Link>
          </Button>
        </div>
      </AdminPageHeader>

      <AdminDataTable
        columns={columns}
        data={products}
        actions={(product) => (
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/impact-store/products/${product.docId}/edit`}>Edit</Link>
          </Button>
        )}
      />
    </div>
  );
}
