
'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  collection,
  onSnapshot,
  type DocumentData,
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirebase } from '@/firebase/client-provider';
import { COLLECTIONS } from '@/lib/firestore/collections';
import { cn } from '@/lib/utils';

type DisplayHeroSlide = {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;

  imageUrl: string;
  mobileImageUrl: string;
  imageAlt: string;

  primaryCtaLabel: string;
  primaryCtaUrl: string;

  secondaryCtaLabel: string;
  secondaryCtaUrl: string;

  isActive: boolean;
  order: number;

  publishStartAt: unknown;
  publishEndAt: unknown;
};

function getString(
  data: DocumentData,
  fieldNames: string[],
  fallback = ''
): string {
  for (const fieldName of fieldNames) {
    const value = data[fieldName];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function getNumber(
  data: DocumentData,
  fieldNames: string[],
  fallback = 0
): number {
  for (const fieldName of fieldNames) {
    const value = data[fieldName];

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (
      typeof value === 'string' &&
      value.trim() &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return fallback;
}

function getActiveStatus(data: DocumentData): boolean {
  if (typeof data.isActive === 'boolean') {
    return data.isActive;
  }

  if (typeof data.active === 'boolean') {
    return data.active;
  }

  /*
   * Existing seeded records may not have either field.
   * Treat those legacy records as active instead of hiding them.
   */
  return true;
}

function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate?: unknown }).toDate === 'function'
  ) {
    try {
      const convertedDate = (
        value as { toDate: () => Date }
      ).toDate();

      return Number.isNaN(convertedDate.getTime())
        ? null
        : convertedDate;
    } catch {
      return null;
    }
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value
  ) {
    const seconds = Number(
      (value as { seconds?: unknown }).seconds
    );

    if (Number.isFinite(seconds)) {
      return new Date(seconds * 1000);
    }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const convertedDate = new Date(value);

    return Number.isNaN(convertedDate.getTime())
      ? null
      : convertedDate;
  }

  return null;
}

function normalizeHeroSlide(
  id: string,
  data: DocumentData
): DisplayHeroSlide {
  const desktopImageUrl = getString(data, [
    'imageUrl',
    'desktopImageUrl',
    'backgroundImageUrl',
    'backgroundImage',
    'image',
  ]);

  return {
    id,

    title: getString(data, ['title', 'heading'], 'Doctors in Business Foundation'),

    eyebrow: getString(data, [
      'eyebrow',
      'kicker',
      'label',
    ]),

    subtitle: getString(data, [
      'subtitle',
      'subheading',
    ]),

    description: getString(data, [
      'description',
      'body',
      'content',
    ]),

    imageUrl: desktopImageUrl,

    mobileImageUrl: getString(
      data,
      ['mobileImageUrl', 'mobileImage'],
      desktopImageUrl
    ),

    imageAlt: getString(
      data,
      ['imageAlt', 'altText'],
      getString(data, ['title', 'heading'], 'DIBF hero image')
    ),

    primaryCtaLabel: getString(data, [
      'primaryCtaLabel',
      'primaryButtonText',
      'buttonText',
      'ctaLabel',
    ]),

    primaryCtaUrl: getString(data, [
      'primaryCtaUrl',
      'primaryButtonUrl',
      'buttonLink',
      'ctaUrl',
    ]),

    secondaryCtaLabel: getString(data, [
      'secondaryCtaLabel',
      'secondaryButtonText',
    ]),

    secondaryCtaUrl: getString(data, [
      'secondaryCtaUrl',
      'secondaryButtonUrl',
    ]),

    isActive: getActiveStatus(data),

    order: getNumber(data, ['order', 'sortOrder'], 999),

    publishStartAt:
      data.publishStartAt ??
      data.publishStartDate ??
      data.startAt ??
      null,

    publishEndAt:
      data.publishEndAt ??
      data.publishEndDate ??
      data.endAt ??
      null,
  };
}

function isPublishable(
  slide: DisplayHeroSlide,
  currentDate: Date
): boolean {
  if (!slide.isActive) {
    return false;
  }

  const startDate = toDate(slide.publishStartAt);
  const endDate = toDate(slide.publishEndAt);

  const hasStarted = !startDate || startDate <= currentDate;
  const hasNotEnded = !endDate || endDate >= currentDate;

  return hasStarted && hasNotEnded;
}

function CtaTarget({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal =
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href) ||
    /^tel:/i.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        target={
          /^https?:\/\//i.test(href)
            ? '_blank'
            : undefined
        }
        rel={
          /^https?:\/\//i.test(href)
            ? 'noopener noreferrer'
            : undefined
        }
      >
        {children}
      </a>
    );
  }

  return <Link href={href}>{children}</Link>;
}

export function Hero() {
  const { db } = useFirebase();

  const [slides, setSlides] = React.useState<
    DisplayHeroSlide[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [currentIndex, setCurrentIndex] =
    React.useState(0);
  const [isPaused, setIsPaused] =
    React.useState(false);

  React.useEffect(() => {
    if (!db) {
      return;
    }

    /*
     * Do not order the Firestore query directly.
     * orderBy() excludes legacy documents that do not yet
     * contain an order field. Sort safely after normalization.
     */
    const slidesCollection = collection(
      db,
      COLLECTIONS.heroSlides
    );

    let initialResponseReceived = false;

    const unsubscribe = onSnapshot(
      slidesCollection,
      (snapshot) => {
        const currentDate = new Date();

        const nextSlides = snapshot.docs
          .map((documentSnapshot) =>
            normalizeHeroSlide(
              documentSnapshot.id,
              documentSnapshot.data()
            )
          )
          .filter((slide) =>
            isPublishable(slide, currentDate)
          )
          .sort(
            (firstSlide, secondSlide) =>
              firstSlide.order - secondSlide.order
          );

        setSlides(nextSlides);

        if (!initialResponseReceived) {
          initialResponseReceived = true;
          setLoading(false);
        }
      },
      (error) => {
        console.error(
          'Error fetching hero slides:',
          error
        );

        setLoading(false);
      }
    );

    return unsubscribe;
  }, [db]);

  React.useEffect(() => {
    slides.forEach((slide) => {
      if (slide.imageUrl) {
        const desktopImage = new window.Image();
        desktopImage.src = slide.imageUrl;
      }

      if (
        slide.mobileImageUrl &&
        slide.mobileImageUrl !== slide.imageUrl
      ) {
        const mobileImage = new window.Image();
        mobileImage.src = slide.mobileImageUrl;
      }
    });
  }, [slides]);

  React.useEffect(() => {
    setCurrentIndex((previousIndex) => {
      if (slides.length === 0) {
        return 0;
      }

      return Math.min(
        previousIndex,
        slides.length - 1
      );
    });
  }, [slides.length]);

  React.useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      return;
    }

    const timerId = window.setInterval(() => {
      setCurrentIndex(
        (previousIndex) =>
          (previousIndex + 1) % slides.length
      );
    }, 6000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [slides.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex(
      (previousIndex) =>
        (previousIndex + 1) % slides.length
    );
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (previousIndex) =>
        (previousIndex - 1 + slides.length) %
        slides.length
    );
  };

  if (loading && slides.length === 0) {
    return <HeroSkeleton />;
  }

  if (!loading && slides.length === 0) {
    return <DefaultHeroSection />;
  }

  const currentSlide = slides[currentIndex];

  if (!currentSlide) {
    return <DefaultHeroSection />;
  }

  const bodyText =
    currentSlide.description ||
    currentSlide.subtitle;

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-secondary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage featured content"
    >
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => {
          const isCurrent =
            index === currentIndex;

          return (
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: isCurrent ? 1 : 0,
              }}
              transition={{
                duration: 1,
                ease: 'easeOut',
              }}
              aria-hidden={!isCurrent}
              style={{
                pointerEvents: isCurrent
                  ? 'auto'
                  : 'none',
              }}
            >
              {slide.imageUrl ? (
                <picture className="absolute inset-0 block">
                  {slide.mobileImageUrl ? (
                    <source
                      media="(max-width: 767px)"
                      srcSet={
                        slide.mobileImageUrl
                      }
                    />
                  ) : null}

                  <img
                    src={slide.imageUrl}
                    alt={slide.imageAlt}
                    className="h-full w-full object-cover"
                    loading={
                      index === 0
                        ? 'eager'
                        : 'lazy'
                    }
                  />
                </picture>
              ) : (
                <div className="absolute inset-0 bg-secondary" />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-secondary/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-transparent to-transparent" />
            </motion.div>
          );
        })}
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-20">
        <div className="max-w-4xl space-y-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{
                duration: 0.55,
                ease: 'easeOut',
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {currentSlide.eyebrow ? (
                  <span className="block text-sm font-bold uppercase tracking-[0.2em] text-accent">
                    {currentSlide.eyebrow}
                  </span>
                ) : null}

                <h1 className="font-headline text-4xl font-bold leading-[1.05] text-white md:text-6xl lg:text-7xl">
                  {currentSlide.title}
                </h1>
              </div>

              {bodyText ? (
                <p className="max-w-2xl font-body text-lg leading-relaxed text-white/85 md:text-xl">
                  {bodyText}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-4 pt-4">
                {currentSlide.primaryCtaLabel &&
                currentSlide.primaryCtaUrl ? (
                  <Button
                    asChild
                    size="lg"
                    className="h-14 rounded-full bg-accent px-10 text-lg font-bold shadow-2xl transition-all hover:bg-accent/90"
                  >
                    <CtaTarget
                      href={
                        currentSlide.primaryCtaUrl
                      }
                    >
                      {
                        currentSlide.primaryCtaLabel
                      }
                    </CtaTarget>
                  </Button>
                ) : null}

                {currentSlide.secondaryCtaLabel &&
                currentSlide.secondaryCtaUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="h-14 gap-2 rounded-full border-white/40 bg-transparent px-10 text-lg font-bold text-white hover:bg-white/10 hover:text-white"
                  >
                    <CtaTarget
                      href={
                        currentSlide.secondaryCtaUrl
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        {
                          currentSlide.secondaryCtaLabel
                        }

                        <ChevronRight className="h-5 w-5" />
                      </span>
                    </CtaTarget>
                  </Button>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            className="p-2 text-white/60 transition-colors hover:text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() =>
                  setCurrentIndex(index)
                }
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  index === currentIndex
                    ? 'w-8 bg-accent'
                    : 'w-2 bg-white/30 hover:bg-white/60'
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={
                  index === currentIndex
                    ? 'true'
                    : undefined
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-2 text-white/60 transition-colors hover:text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

function HeroSkeleton() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-secondary">
      <Skeleton className="absolute inset-0 h-full w-full" />

      <div className="container relative z-10 mx-auto px-4 pt-20">
        <div className="max-w-4xl space-y-8">
          <div className="space-y-6">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-8 w-1/2" />

            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-14 w-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DefaultHeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-secondary">
      <div className="container relative z-10 mx-auto px-4 pt-20">
        <div className="max-w-4xl space-y-8 text-white">
          <h1 className="font-headline text-4xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
            Doctors in Business Foundation
          </h1>

          <p className="max-w-2xl font-body text-lg leading-relaxed text-white/85 md:text-xl">
            Advancing health, human dignity and sustainable
            development through service, partnership and
            innovation.
          </p>

          <Button
            asChild
            size="lg"
            className="h-14 rounded-full bg-accent px-10 text-lg font-bold hover:bg-accent/90"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

