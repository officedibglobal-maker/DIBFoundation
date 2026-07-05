'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeroSlide = Record<string, unknown> & {
  id?: string;
  title?: string;
  headline?: string;
  subtitle?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

interface HeroProps {
  slides?: HeroSlide[];
}

const fallbackSlides: HeroSlide[] = [
  {
    id: 'fallback-hero',
    headline: 'Advancing Health, Human Dignity, and Sustainable Development.',
    description:
      'DIBF is the nonprofit and social impact arm of Doctors in Business Global, dedicated to advancing health equity, community wellbeing, youth empowerment, and sustainable humanitarian impact across Africa and underserved communities globally.',
    primaryCtaLabel: 'Donate Now',
    primaryCtaHref: '/give',
    secondaryCtaLabel: 'Partner With Us',
    secondaryCtaHref: '/get-involved/partner',
  },
];

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function getStringValue(value: unknown): string {
  if (!value) return '';

  if (typeof value === 'string') {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return getStringValue(value[0]);
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    return (
      getStringValue(objectValue.url) ||
      getStringValue(objectValue.src) ||
      getStringValue(objectValue.downloadURL) ||
      getStringValue(objectValue.imageUrl) ||
      getStringValue(objectValue.path)
    );
  }

  return '';
}

function getFirstString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = getStringValue(record[key]);

    if (value) return value;
  }

  return '';
}

function getHeroImage(slide: HeroSlide) {
  return getFirstString(slide, [
    'imageUrl',
    'imageURL',
    'image',
    'backgroundImage',
    'backgroundImageUrl',
    'heroImage',
    'heroImageUrl',
    'coverImage',
    'coverImageUrl',
    'featuredImage',
    'featuredImageUrl',
    'thumbnailUrl',
    'photoUrl',
    'mediaUrl',
    'desktopImage',
    'desktopImageUrl',
    'bannerImage',
    'bannerImageUrl',
    'images',
    'photos',
  ]);
}

function getHeroHeadline(slide: HeroSlide) {
  return (
    getFirstString(slide, ['headline', 'title', 'heading', 'name']) ||
    fallbackSlides[0].headline!
  );
}

function getHeroDescription(slide: HeroSlide) {
  return (
    getFirstString(slide, ['description', 'subtitle', 'summary', 'body']) ||
    fallbackSlides[0].description!
  );
}

export function Hero({ slides = [] }: HeroProps) {
  const displaySlides = slides.length > 0 ? slides : fallbackSlides;
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (displaySlides.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % displaySlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [displaySlides.length]);

  const activeSlide = displaySlides[activeIndex] || displaySlides[0];
  const imageUrl = getHeroImage(activeSlide);
  const headline = getHeroHeadline(activeSlide);
  const description = getHeroDescription(activeSlide);

  const primaryLabel =
    getFirstString(activeSlide, ['primaryCtaLabel', 'primaryButtonText', 'ctaText']) ||
    'Donate Now';

  const primaryHref =
    getFirstString(activeSlide, ['primaryCtaHref', 'primaryButtonHref', 'ctaLink']) ||
    '/give';

  const secondaryLabel =
    getFirstString(activeSlide, ['secondaryCtaLabel', 'secondaryButtonText']) ||
    'Partner With Us';

  const secondaryHref =
    getFirstString(activeSlide, ['secondaryCtaHref', 'secondaryButtonHref']) ||
    '/get-involved/partner';

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-secondary text-white">
      <AnimatePresence mode="wait">
        {imageUrl ? (
          <motion.div
            key={`${activeSlide.id || activeIndex}-${imageUrl}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
        ) : (
          <motion.div
            key="hero-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.45),transparent_34%),linear-gradient(135deg,#061a33_0%,#082f5f_55%,#031326_100%)]"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/88 to-secondary/35" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary to-transparent" />

      <div className="container relative z-10 mx-auto flex min-h-[760px] max-w-7xl items-center px-4 py-28">
        <div className="max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100 backdrop-blur-md"
          >
            <HeartHandshake className="h-4 w-4" />
            Healing communities. Empowering futures.
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id || activeIndex}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
                {headline}
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-9 text-white/75 md:text-xl">
                {description}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-base font-bold">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-white/25 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md hover:bg-white hover:text-secondary"
            >
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </motion.div>

          {displaySlides.length > 1 ? (
            <div className="mt-10 flex gap-2">
              {displaySlides.map((slide, index) => (
                <button
                  key={slide.id || `hero-dot-${index}`}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-10 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}