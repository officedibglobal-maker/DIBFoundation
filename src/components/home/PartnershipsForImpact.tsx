'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Handshake,
  HeartHandshake,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { HomepageSectionSettings } from '@/lib/firestore/homepage-settings';

type Partner = {
  id?: string;
  name?: string;
  logoUrl?: string;
};

interface PartnershipsForImpactProps {
  partners?: Partner[];
  settings?: HomepageSectionSettings;
}

export function PartnershipsForImpact({
  partners = [],
  settings,
}: PartnershipsForImpactProps) {
  const sectionLabel = settings?.sectionLabel || 'Partnerships for Impact';

  const sectionTitle =
    settings?.sectionTitle || 'Meaningful change is shared work.';

  const sectionBody =
    settings?.sectionBody ||
    'DIBF welcomes collaboration with universities, healthcare institutions, corporations, foundations, development organizations, community groups, researchers, philanthropists, and individuals who share a commitment to improving lives and advancing sustainable development.';

  const imageUrl = settings?.imageUrl || '';

  const ctaLabel = settings?.ctaLabel || 'Become a Partner';

  const ctaLink = settings?.ctaLink || '/get-involved/partner';

  return (
    <section className="relative overflow-hidden bg-primary py-20 text-white md:py-24 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_30%),linear-gradient(135deg,rgba(3,19,38,0.15),rgba(3,19,38,0.5))]" />

      <div className="container relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-[1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
        >
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-blue-100">
            {sectionLabel}
          </p>

          <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            {sectionTitle}
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-9 text-white/75">
            {sectionBody}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-white px-8 font-bold text-primary hover:bg-white/90"
            >
              <Link href={ctaLink}>
                {ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-white/30 bg-white/10 px-8 font-bold text-white hover:bg-white hover:text-primary"
            >
              <Link href="/partnerships">Explore Partnerships</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.35 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {imageUrl ? (
            <div className="sm:col-span-2 overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl">
              <img
                src={imageUrl}
                alt={sectionTitle}
                className="h-72 w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ) : null}

          {[
            { title: 'Universities', icon: GraduationCap },
            { title: 'Healthcare Institutions', icon: HeartHandshake },
            { title: 'Corporations & CSR', icon: Building2 },
            { title: 'Community Partners', icon: Handshake },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
              >
                <Icon className="h-8 w-8 text-blue-100" />
                <h3 className="mt-5 text-xl font-extrabold">{item.title}</h3>
              </div>
            );
          })}

          {partners.length > 0 ? (
            <div className="sm:col-span-2 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-100">
                Growing partner network
              </p>
              <p className="mt-2 text-3xl font-black">
                {partners.length}+ Partners
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}