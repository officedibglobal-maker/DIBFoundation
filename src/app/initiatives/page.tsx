
"use client";

import * as React from 'react';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemo, useState, useEffect } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function InitiativesPage() {
  const { db, status, error } = useFirestore();
  const [isLoading, setIsLoading] = useState(true);
  const initiativesQuery = useMemo(() => {
    if (status !== 'ready' || !db) return null;
    return query(collection(db, 'initiatives'), orderBy('order', 'asc'));
  }, [db, status]);
  const { data: initiatives, loading } = useCollection(initiativesQuery);

  useEffect(() => {
      if (status === 'ready' || status === 'error') {
          setIsLoading(false);
      }
  }, [status, initiatives]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div className="min-h-screen">
      <section className="bg-secondary text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Our Initiatives</h1>
          <p className="text-xl text-white/70 leading-relaxed">
            Our flagship initiatives are designed to create lasting impact by addressing healthcare, education, youth empowerment, and community development.
          </p>
        </div>
      </section>

      <section id="projects" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Flagship Programs" 
            subtitle="Scaling impact through targeted, sustainable programs that address critical needs across Africa."
          />
          
          <div className="space-y-20">
            {(loading ? Array.from({length: 3}).map((_, i) => ({id: i})) : initiatives).map((item, idx) => {
              const itemData = item as any;
              return (
              <div key={itemData.id} className={cn("grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", idx % 2 === 1 && "lg:flex-row-reverse")}>
                <div className={cn("space-y-8", idx % 2 === 1 && "lg:order-2")}>
                  <div className="space-y-4">
                    {loading ? <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div> : <span className="text-primary font-bold uppercase tracking-widest text-sm">{itemData.category}</span>}
                    {loading ? <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div> : <h3 className="text-3xl md:text-4xl font-bold text-secondary font-headline">{itemData.title}</h3>}
                    {loading ? <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div> : <p className="text-lg text-muted-foreground leading-relaxed">{itemData.description}</p>}
                  </div>
                  
                  {!loading && itemData.bullets && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {itemData.bullets.map((bullet: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                          <span className="text-secondary font-medium">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {loading ? <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div> : 
                  <Button asChild className="h-12 px-8 font-bold gap-2">
                    <Link href={`/initiatives/${itemData.slug || '#'}`}>
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>}
                </div>
                
                <div className={cn("relative h-[450px] rounded-3xl overflow-hidden shadow-2xl", idx % 2 === 1 && "lg:order-1")}>
                  {loading ? <div className="w-full h-full bg-gray-200 animate-pulse"></div> : 
                  <Image 
                    src={itemData.imageUrl || `https://picsum.photos/seed/${itemData.slug || idx}/800/600`} 
                    alt={itemData.title} 
                    fill 
                    className="object-cover"
                  />}
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Together, We Create Lasting Impact.</h2>
          <p className="text-lg text-white/80">Join us in building healthier, stronger, and more equitable communities across Africa.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="px-10 h-14 font-bold shadow-xl">
              <Link href="/get-involved">Get Involved</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-10 h-14 font-bold border-white text-white hover:bg-white/10">
              <Link href="/give">Make a Donation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
