'use client';

import Link from 'next/link';
import { ArrowRight, Eye, HeartHandshake, Target, Users } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';

const cards = [
  {
    title: 'Who We Are',
    description:
      'Doctors in Business Foundation is a health and community development foundation dedicated to advancing health equity, strengthening community wellbeing, and supporting sustainable development across Africa and underserved communities globally.',
    icon: Users,
    accent: 'from-blue-500/15 to-blue-50',
    iconClass: 'bg-blue-50 text-blue-700',
    borderClass: 'hover:border-blue-300',
  },
  {
    title: 'Our Mission',
    description:
      'To create sustainable pathways for people, institutions, and communities to improve lives, improve healthcare, and advance human dignity through service, partnership, innovation, and purposeful giving.',
    icon: Target,
    accent: 'from-amber-500/15 to-amber-50',
    iconClass: 'bg-amber-50 text-amber-700',
    borderClass: 'hover:border-amber-300',
  },
  {
    title: 'Our Vision',
    description:
      'A world where every person, institution, and community has a meaningful pathway to create lasting impact, and where Africa’s challenges inspire global collaboration, innovation, and shared responsibility.',
    icon: Eye,
    accent: 'from-emerald-500/15 to-emerald-50',
    iconClass: 'bg-emerald-50 text-emerald-700',
    borderClass: 'hover:border-emerald-300',
  },
];

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
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

export function MissionVision() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-24 lg:py-28">
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-primary">
              Purpose-Driven Foundation
            </p>

            <h2 className="text-4xl font-black leading-tight tracking-tight text-secondary md:text-5xl lg:text-6xl">
              A Platform for Health, Dignity, and Lasting Impact
            </h2>

            <p className="mt-6 text-lg leading-9 text-muted-foreground">
              DIBF brings together healthcare, education, service, philanthropy,
              and community engagement to improve lives and strengthen communities.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/about"
                className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Learn About DIBF
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/about/mission-vision"
                className="inline-flex h-14 items-center justify-center rounded-full border border-slate-300 bg-white px-8 text-base font-bold text-secondary transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                Mission & Vision
              </Link>
            </div>

            <div className="mt-10 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
                  <HeartHandshake className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-primary">
                    Shared impact model
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    We connect people, institutions, donors, healthcare
                    professionals, and communities around practical action and
                    long-term transformation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6">
            {cards.map((card, index) => {
              const Icon = card.icon;

              return (
                <motion.article
                  key={card.title}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  custom={index}
                  viewport={{ once: true, amount: 0.35 }}
                  className={`group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${card.borderClass}`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-70`}
                  />

                  <div className="relative flex gap-5">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl transition-all duration-300 group-hover:scale-105 ${card.iconClass}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-secondary">
                        {card.title}
                      </h3>

                      <p className="mt-4 text-base leading-8 text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}