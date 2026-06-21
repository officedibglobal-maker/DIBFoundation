
"use client";

import { Stethoscope, GraduationCap, BrainCircuit, Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { getDocuments } from '@/lib/firestore/crud';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { FocusArea } from '@/types/firestore';
import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const ICON_MAP: Record<string, any> = {
  Stethoscope,
  GraduationCap,
  BrainCircuit,
  Heart
};

export function WhatWeDoGrid() {
  const { db, status, error } = useFirestore();
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);

  const defaultAreas: FocusArea[] = [
    {
      title: "Health & Wellbeing",
      slug: "health-wellbeing",
      summary: "Improving access to care and promoting healthier, stronger communities.",
      description: "",
      iconName: "Stethoscope",
      imageUrl: "",
      imageAlt: "",
      accentStyle: "blue",
      ctaLabel: "Learn More",
      ctaHref: "/what-we-do",
      order: 1,
      status: "published",
    },
    {
      title: "Youth Empowerment",
      slug: "youth-empowerment",
      summary: "Equipping young people with opportunities, leadership, and skills for the future.",
      description: "",
      iconName: "GraduationCap",
      imageUrl: "",
      imageAlt: "",
      accentStyle: "green",
      ctaLabel: "Learn More",
      ctaHref: "/what-we-do",
      order: 2,
      status: "published",
    },
    {
      title: "Mental Health",
      slug: "mental-health",
      summary: "Promoting mental wellbeing, resilience, and support for youth and communities.",
      description: "",
      iconName: "BrainCircuit",
      imageUrl: "",
      imageAlt: "",
      accentStyle: "purple",
      ctaLabel: "Learn More",
      ctaHref: "/what-we-do",
      order: 3,
      status: "published",
    },
    {
      title: "Sustainable Giving",
      slug: "sustainable-giving",
      summary: "Mobilizing resources today to create lasting impact tomorrow.",
      description: "",
      iconName: "Heart",
      imageUrl: "",
      imageAlt: "",
      accentStyle: "red",
      ctaLabel: "Learn More",
      ctaHref: "/what-we-do",
      order: 4,
      status: "published",
    }
  ];

  const focusAreasQuery = useMemo(() => {
    if (status !== "ready" || !db) {
      return null;
    }
  
    return query(
      collection(db, COLLECTIONS.focusAreas),
      where("status", "==", "published"),
      orderBy("order", "asc")
    );
  }, [db, status]);

  useEffect(() => {
    async function fetchFocusAreas() {
      if (!focusAreasQuery) return;
      try {
        const areas = await getDocuments<FocusArea>(db, COLLECTIONS.focusAreas, [orderBy("order", "asc")]);
        setFocusAreas(areas.length > 0 ? areas : defaultAreas);
      } catch (error) {
        console.error("Error fetching focus areas:", error);
        setFocusAreas(defaultAreas);
      }
    }

    fetchFocusAreas();
  }, [db, focusAreasQuery, defaultAreas]);

  const data = focusAreas.length > 0 ? focusAreas : defaultAreas;

  if (status === 'loading') {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <Skeleton className="h-4 w-24 mx-auto" />
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="border-none shadow-xl rounded-3xl p-4">
                            <CardHeader className="pb-4">
                                <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
                                <Skeleton className="h-8 w-3/4" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-8 w-24" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <Skeleton className="h-12 w-48 mx-auto" />
                </div>
            </div>
        </section>
    )
  }
  
  if (status === 'error') {
      return <p>Error loading content.</p>
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">What We Do</span>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-secondary">Creating Lasting Impact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((item, idx) => {
            const Icon = ICON_MAP[item.iconName] || Heart;
            return (
              <Card key={idx} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-3xl p-4">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-headline font-bold text-secondary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    {item.summary}
                  </p>
                  <Link 
                    href={item.ctaHref || "/what-we-do"} 
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                  >
                    {item.ctaLabel} <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" asChild className="rounded-full px-10 h-12 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
            <Link href="/what-we-do">View All Focus Areas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
