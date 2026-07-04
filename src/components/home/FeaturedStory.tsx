"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { getCollectionDocuments } from '@/lib/firestore/crud';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { ImpactStory } from '@/types/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { FirebaseError } from 'firebase/app';

function FeaturedStorySkeleton() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <Skeleton className="relative h-[400px] md:h-[500px] rounded-2xl" />
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-3/4" />
                        </div>
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-8 w-48" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturedStoryFallback({ error }: { error: Error | FirebaseError }) {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <h2>Error Loading Featured Story</h2>
                <p>{error.message}</p>
            </div>
        </section>
    );
}


export function FeaturedStory() {
  const { db, status, error } = useFirestore();
  const [story, setStory] = useState<ImpactStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    if (status !== "ready" || !db) {
      if (status === 'ready' && !db) {
        setLoading(false);
      }
      return;
    }

    let active = true;

    async function loadFeaturedStory() {
      try {
        const stories = await getCollectionDocuments<ImpactStory>(
          COLLECTIONS.impactStories
        );

        if (!active) {
          return;
        }

        const featured =
          stories.find(
            (story) =>
              story.featured === true &&
              story.status === "published"
          ) ??
          stories.find(
            (story) => story.status === "published"
          ) ??
          null;

        setStory(featured);
      } catch (loadError) {
        if (active) {
          setLoadError(
            loadError instanceof Error
              ? loadError
              : new Error(
                  "Unable to load the featured story."
                )
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadFeaturedStory();

    return () => {
      active = false;
    };
  }, [db, status]);

  if (loading) {
    return <FeaturedStorySkeleton />;
  }

  if (status === "error") {
    return (
      <FeaturedStoryFallback
        error={
          error ??
          new Error("Firebase initialization failed.")
        }
      />
    );
  }

  if (loadError) {
    return <FeaturedStoryFallback error={loadError} />;
  }
  
  if (!story) {
      return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image 
              src={story.imageUrl || "https://picsum.photos/seed/featured-story/800/600"} 
              alt={story.title} 
              fill 
              className="object-cover"
              data-ai-hint="african community"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Featured Story</span>
              <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline leading-tight">
                {story.title}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {story.excerpt || story.summary}
            </p>
            <Link 
              href={`/impact`}
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
            >
              Read the full story <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
