
"use client";

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase/firestore/use-firestore';
import { getCollectionDocuments } from '@/lib/firestore/crud';
import { HeroSlide } from '@/types/firestore';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { db, status } = useFirestore();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (status !== 'ready' || !db) return;
    const fetchSlides = async () => {
      const slidesData = await getCollectionDocuments<HeroSlide>(COLLECTIONS.heroSlides);
      const publishedSlides = slidesData.filter(slide => slide.status === 'published');
      setSlides(publishedSlides);
    };
    fetchSlides();
  }, [db, status]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (slides.length === 0) {
    return <div>Loading...</div>; // Or a placeholder component
  }

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
          <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">{slide.subtitle}</p>
            <Button asChild>
              <a href={slide.ctaUrl}>{slide.ctaText}</a>
            </Button>
          </div>
        </div>
      ))}

      <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white">&#10094;</button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 p-2 rounded-full text-white">&#10095;</button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}></button>
        ))}
      </div>
    </section>
  );
}
