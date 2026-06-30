
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { seedImpactStore } from '@/lib/impact-store/seed';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase/firestore/use-firestore';

export function SeedProductsButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { db } = useFirestore();

  const handleSeed = async () => {
    if (!db) {
      toast({
        title: 'Error seeding database',
        description: 'Firebase is not available. Please try again later.',
        variant: 'destructive',
      });
      return;
    }

    if (!confirm('Are you sure you want to load sample products?')) return;

    setLoading(true);
    try {
      const { categoriesCreated, categoriesSkipped, productsCreated, productsSkipped } = await seedImpactStore(db);
      toast({
        title: 'Seeding complete',
        description: `Created ${categoriesCreated} categories, skipped ${categoriesSkipped}. Created ${productsCreated} products, skipped ${productsSkipped}.`,
      });
      router.refresh();
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: 'Error seeding database',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={loading}>
      {loading ? 'Loading...' : 'Load Sample Products'}
    </Button>
  );
}
