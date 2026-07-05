'use client';

import * as React from 'react';
import { motion, type Variants } from 'framer-motion';

type Stat = {
  id?: string;
  label?: string;
  title?: string;
  value?: number | string;
  number?: number | string;
  prefix?: string;
  suffix?: string;
};

interface ImpactStatsProps {
  stats?: Stat[];
}

const fallbackStats: Stat[] = [
  { id: 'lives', value: '15K+', label: 'Lives Impacted' },
  { id: 'clinics', value: '45+', label: 'Community Clinics' },
  { id: 'projects', value: '12+', label: 'Regional Projects' },
  { id: 'partners', value: '20+', label: 'Global Partners' },
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

export function ImpactStats({ stats = [] }: ImpactStatsProps) {
  const displayStats = stats.length > 0 ? stats : fallbackStats;

  return (
    <section className="relative z-20 -mt-20 pb-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-4 rounded-3xl border border-white/60 bg-white p-5 shadow-2xl shadow-blue-950/10 md:grid-cols-2 lg:grid-cols-4">
          {displayStats.slice(0, 4).map((stat, index) => {
            const value = stat.value ?? stat.number ?? '0';
            const label = stat.label ?? stat.title ?? 'Impact';

            return (
              <motion.div
                key={stat.id || `${label}-${index}`}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                custom={index}
                viewport={{ once: true, amount: 0.4 }}
                className="rounded-2xl bg-slate-50 px-6 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-lg"
              >
                <div className="text-3xl font-black text-secondary md:text-4xl">
                  {stat.prefix}
                  {value}
                  {stat.suffix}
                </div>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  {label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}