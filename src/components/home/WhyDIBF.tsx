'use client';

import { CheckCircle, HeartHandshake, ShieldCheck } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import type { HomepageSectionSettings } from '@/lib/firestore/homepage-settings';

interface WhyDIBFProps {
  settings?: HomepageSectionSettings;
}

const features = [
  {
    name: 'Healthcare Knowledge',
    description:
      'DIBF is shaped by healthcare insight, service experience, and a deep commitment to improving lives.',
  },
  {
    name: 'Community-Centered Development',
    description:
      'Our initiatives are designed around real community needs, dignity, access, and sustainable wellbeing.',
  },
  {
    name: 'Sustainable Giving',
    description:
      'We transform shared responsibility into purposeful giving that supports long-term impact.',
  },
  {
    name: 'Strategic Partnerships',
    description:
      'We work with institutions, professionals, partners, donors, and communities to create change that lasts.',
  },
];

const values = [
  'Service with dignity',
  'Partnership with purpose',
  'Development that lasts',
];

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function WhyDIBF({ settings }: WhyDIBFProps) {
  const sectionLabel = settings?.sectionLabel || 'Why DIBF';

  const sectionTitle =
    settings?.sectionTitle || 'A trusted platform for shared impact.';

  const sectionBody =
    settings?.sectionBody ||
    'DIBF stands as a trusted platform for health, humanitarian service, sustainable giving, education, and community-centered development.';

  const imageUrl = settings?.imageUrl || '';

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 md:py-24 lg:py-28">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.35 }}
              className="max-w-3xl"
            >
              <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">
                {sectionLabel}
              </p>

              <h2 className="text-4xl font-black leading-tight tracking-tight text-secondary md:text-5xl">
                {sectionTitle}
              </h2>

              <p className="mt-6 text-lg leading-9 text-muted-foreground">
                {sectionBody}
              </p>
            </motion.div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.article
                  key={feature.name}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{ once: true, amount: 0.35 }}
                  className="group rounded-[1.7rem] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <CheckCircle className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-black text-secondary">
                    {feature.name}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            className="relative overflow-hidden rounded-[2rem] bg-secondary p-8 text-white shadow-2xl md:p-10 lg:p-12"
          >
            {imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${imageUrl}")` }}
              />
            ) : null}

            {imageUrl ? (
              <>
                <div className="absolute inset-0 bg-secondary/70" />
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 via-secondary/55 to-primary/35" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.35),transparent_34%),linear-gradient(135deg,#061a33,#0b5db8)]" />
              </>
            )}

            <div className="relative">
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
                <HeartHandshake className="h-8 w-8" />
              </div>

              <h3 className="text-3xl font-black leading-tight md:text-4xl">
                Impact is strongest when it is shared, sustainable, and rooted
                in genuine partnership.
              </h3>

              <p className="mt-7 text-base leading-8 text-white/80">
                Every initiative is approached with the intention to create
                value that lasts, strengthen human dignity, and support pathways
                toward healthier and more sustainable communities.
              </p>

              <div className="mt-10 space-y-4">
                {values.map((value) => (
                  <div
                    key={value}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur"
                  >
                    <ShieldCheck className="h-5 w-5 shrink-0 text-blue-100" />
                    <span className="text-sm font-bold text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}