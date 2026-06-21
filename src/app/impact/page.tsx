
"use client";

import * as React from 'react';
import { useMemo } from 'react';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit } from 'firebase/firestore';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ArrowRight, Heart } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ImpactPage() {
  const { db, status, error } = useFirestore();
  
  const storiesQuery = useMemo(() => {
    if (status !== 'ready' || !db) return null;
    return query(collection(db, 'impactStories'), where('featured', '==', true), limit(6));
  }, [db, status]);

  const { data: stories, loading } = useCollection(storiesQuery);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'error') {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div className="min-h-screen">
      <section className="bg-secondary text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Our Impact</h1>
          <p className="text-xl text-white/70 leading-relaxed">
            Every life touched, every community strengthened, and every partnership formed brings us closer to a healthier, more equitable world.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary text-white border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-5xl font-bold text-accent">15K+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Lives Impacted</p>
            </div>
            <div>
              <p className="text-3xl md:text-5xl font-bold text-accent">100+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Communities Reached</p>
            </div>
            <div>
              <p className="text-3xl md:text-5xl font-bold text-accent">80+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Programs Delivered</p>
            </div>
            <div>
              <p className="text-3xl md:text-5xl font-bold text-accent">50+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Partner Collaborations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Stories of Impact" subtitle="A collection of narratives highlighting the transformative power of shared responsibility." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(loading ? Array.from({length: 6}).map((_, i) => ({id: i})) : stories).map((story, i) => (
              <Card key={story.id || i} className="h-full border-none shadow-lg overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  {loading ? <div className="w-full h-full bg-muted animate-pulse"></div> :
                  <Image 
                    src={(story as any).imageUrl || `https://picsum.photos/seed/story-${i}/600/400`} 
                    alt={(story as any).title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-primary">{(story as any).category}</span>
                  </div>
                </div>
                <CardContent className="p-8 flex-1 space-y-4">
                  <h4 className="text-xl font-bold text-secondary">{(story as any).title}</h4>
                  <p className="text-muted-foreground line-clamp-3 leading-relaxed">{(story as any).summary}</p>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer group-hover:gap-3 transition-all">
                    Read full story <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="reports" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-20 space-y-8">
              <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text.sm">
                <FileText className="w-5 h-5" /> Transparency
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-secondary font-headline">2024 Annual Impact Report</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A year of progress, partnerships, and purpose. Explore how we’ve deployed resources to create sustainable health outcomes.
              </p>
              <ul className="space-y-4">
                {["Program Highlights", "Community Outcomes", "Financial Transparency", "Partner Collaborations"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-secondary font-medium">
                    <div className="w-2 h-2 bg-primary rounded-full" /> {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="h-14 px-10 font-bold gap-2 shadow-xl">
                Download Full Report <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative bg-primary overflow-hidden hidden lg:block">
              <Image 
                src="https://picsum.photos/seed/report-bg/800/1000" 
                alt="Report" 
                fill 
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-2xl rotate-3">
                  <div className="w-40 h-56 bg-secondary rounded flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                    <Heart className="w-10 h-10 text-accent" />
                    <p className="font-bold text-xs uppercase tracking-widest">DIBF 2024</p>
                    <p className="text-[10px] opacity-60 italic">Advancing Human Dignity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
