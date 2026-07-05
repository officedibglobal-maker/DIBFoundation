'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { HomepageSectionSettings } from '@/lib/firestore/homepage-settings';

interface BePartOfTheJourneyProps {
  settings?: HomepageSectionSettings;
}

export function BePartOfTheJourney({ settings }: BePartOfTheJourneyProps) {
  const sectionLabel = settings?.sectionLabel || 'Be Part of the Journey';

  const title =
    settings?.sectionTitle || 'Creating lasting change calls for all of us.';

  const body =
    settings?.sectionBody ||
    'Every act of service, every partnership, every contribution, and every opportunity to uplift others helps build stronger and more sustainable communities across Africa and underserved communities globally.';

  const backgroundImageUrl =
    settings?.backgroundImageUrl || settings?.imageUrl || '';

  const ctaLabel = settings?.ctaLabel || 'Give Now';
  const ctaLink = settings?.ctaLink || '/give';

  return (
    <section className="bg-white py-20 md:py-24 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          className="relative overflow-hidden rounded-[2rem] bg-secondary px-6 py-16 text-center text-white shadow-2xl md:px-12 lg:px-20 lg:py-24"
        >
          {backgroundImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
            />
          ) : null}

          {backgroundImageUrl ? (
            <>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/35 via-secondary/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/35 via-transparent to-transparent" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-secondary" />
              <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            </>
          )}

          <div className="relative mx-auto max-w-4xl">
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/25 backdrop-blur">
              <Heart className="h-8 w-8 fill-current text-white" />
            </div>

            <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-white drop-shadow">
              {sectionLabel}
            </p>

            <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-xl md:text-5xl">
              {title}
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white drop-shadow">
              {body}
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full px-8 font-bold">
                <Link href={ctaLink}>
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/50 bg-white/25 px-8 font-bold text-white backdrop-blur hover:bg-white hover:text-secondary"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}