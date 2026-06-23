
"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { Skeleton } from '@/components/ui/skeleton';
import { HeroSlide } from '@/types/firestore';

export function Hero() {
  const { db, status } = useFirestore();
  const [slides, setSlides] = React.useState<HeroSlide[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const defaultSlides: HeroSlide[] = React.useMemo(() => [
    {
      title: "Creating Pathways. Transforming Lives. Building Stronger Communities.",
      subtitle: "Advancing Health. Human Dignity. Sustainable Development.",
      body: "DIBF advances health equity, community wellbeing, youth empowerment, and sustainable development across Africa and underserved communities worldwide.",
      imageUrl: "https://picsum.photos/seed/dibf-hero-default/1920/1080",
      primaryCtaLabel: "Support Our Work",
      primaryCtaHref: "/get-involved",
      secondaryCtaLabel: "Explore Initiatives",
      secondaryCtaHref: "/initiatives",
      order: 1,
      status: "published",
    }
  ], []);

  React.useEffect(() => {
    async function fetchSlides() {
      if (status === 'ready' && db) {
        try {
          const slidesQuery = query(
            collection(db, COLLECTIONS.heroSlides),
            where("status", "==", "published"),
            orderBy("order", "asc")
          );
          const querySnapshot = await getDocs(slidesQuery);
          const fetchedSlides = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as HeroSlide[];
          
          setSlides(fetchedSlides.length > 0 ? fetchedSlides : defaultSlides);
        } catch (error) {
          console.error("Error fetching hero slides:", error);
          setSlides(defaultSlides);
        } finally {
          setLoading(false);
        }
      } else if (status === 'error') {
        setSlides(defaultSlides);
        setLoading(false);
      }
    }
    void fetchSlides();
  }, [db, status, defaultSlides]);

  const data = slides;

  React.useEffect(() => {
    if (data.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [data.length, isPaused]);

  if (loading) {
    return (
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary">
          <Skeleton className="absolute inset-0 z-0 w-full h-full" />
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-4xl space-y-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-1/2" />
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Skeleton className="h-14 w-40" />
                    <Skeleton className="h-14 w-40" />
                  </div>
                </div>
          </div>
        </div>
      </section>
    );
  }

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % data.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);

  const currentSlide = data[currentIndex];

  if (!currentSlide) {
      // This can happen briefly if slides are cleared
      return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary">
            <Skeleton className="absolute inset-0 z-0 w-full h-full" />
        </section>
      );
  }

  const primaryCtaLabel = currentSlide.primaryCtaLabel || currentSlide.ctaText || "Learn More";
  const primaryCtaHref = currentSlide.primaryCtaHref || currentSlide.ctaUrl || "/get-involved";
  const secondaryCtaLabel = currentSlide.secondaryCtaLabel || "Explore Initiatives";
  const secondaryCtaHref = currentSlide.secondaryCtaHref || "/initiatives";

  return (
    <section 
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src={currentSlide.imageUrl || "https://picsum.photos/seed/dibf-placeholder/1920/1080"}
            alt={currentSlide.imageAlt || currentSlide.title || "DIBF"}
            fill
            className="object-cover opacity-60"
            priority
            data-ai-hint="medical doctor healthcare"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <span className="text-accent font-bold uppercase tracking-[0.2em] text-sm block">
                  {currentSlide.subtitle}
                </span>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] font-headline">
                  {currentSlide.title}
                </h1>
              </div>
              
              <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-body">
                {currentSlide.body}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                {primaryCtaLabel && (
                  <Button asChild size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl bg-accent hover:bg-accent/90 rounded-full transition-all">
                    <Link href={primaryCtaHref}>
                      {primaryCtaLabel}
                    </Link>
                  </Button>
                )}
                {secondaryCtaLabel && (
                  <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-white/30 text-white hover:bg-white/10 rounded-full transition-all gap-2">
                    <Link href={secondaryCtaHref}>
                      {secondaryCtaLabel} <ChevronRight className="w-5 h-5" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {data.length > 1 && (
        <>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
            <button 
              onClick={handlePrev}
              className="p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-2">
              {data.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "h-1.5 transition-all duration-500 rounded-full",
                    i === currentIndex ? "w-8 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="p-2 text-white/40 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
